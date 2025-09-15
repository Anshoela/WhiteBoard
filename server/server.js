const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const roomsRouter = require("./routes/rooms");
app.use("/api/rooms", roomsRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

// connection with mongodb
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Not connected", err));


const strokeSchema = new mongoose.Schema(
  {
    room: String,
    color: String,
    width: Number,
    points: [{ x: Number, y: Number }]
  },
  { timestamps: true }
);

const Stroke = mongoose.model("Stroke", strokeSchema);

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);
  let currentRoom = null;

  // join room
  socket.on("join-room", async (roomId) => {
    socket.join(roomId);
    currentRoom = roomId;
    console.log(`${socket.id} joined ${roomId}`);


    const strokes = await Stroke.find({ room: roomId }).sort({ createdAt: 1 });
    socket.emit("load-strokes", strokes);

    // update user count
    const count = io.sockets.adapter.rooms.get(roomId)?.size || 0;
    io.to(roomId).emit("user-count", { roomId, count });
  });


  socket.on("draw-start", ({ room, x, y, color, width }) => {
    socket.to(room).emit("draw-start", { x, y, color, width });
  });

  socket.on("draw-move", ({ room, x, y, color, width }) => {
    socket.to(room).emit("draw-move", { x, y, color, width });
  });

  socket.on("draw-end", async ({ room, points, color, width }) => {
    if (!points || points.length === 0) return;
    await Stroke.create({ room, color, width, points });
    console.log(`saved stroke with ${points.length} points in room ${room}`);
  });


  socket.on("clear-canvas", async (room) => {
    try {
      if (!room) {
        console.log("No room provided for clear-canvas");
        return;
      }
      await Stroke.deleteMany({ room });
      io.to(room).emit("clear-canvas");
      console.log(`cleared canvas + DB for room ${room}`);
    } catch (err) {
      console.log("Error clearing canvas", err);
    }
  });


  socket.on("cursor-move", ({ room, userId, x, y, name, color }) => {
    socket.to(room).emit("cursor-move", { userId, x, y, name, color });
  });


  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
    if (currentRoom) {
      const count = io.sockets.adapter.rooms.get(currentRoom)?.size || 0;
      io.to(currentRoom).emit("user-count", { roomId: currentRoom, count });
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
