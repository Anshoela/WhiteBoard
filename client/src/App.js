import React, { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Toolbar from "./components/Toolbar";
import RoomJoin from "./components/RoomJoin";
import DrawingCanvas from "./components/DrawingCanvas";
import Whiteboard from "./components/Whiteboard";

const socket = io("http://localhost:5000");

function App() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [currentStroke, setCurrentStroke] = useState([]);

  useEffect(() => {
    if (!joined) return;

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctxRef.current = ctx;

    // Replay saved strokes
    socket.on("load-strokes", (strokes) => {
      strokes.forEach(({ points, color, width }) => {
        if (!points || points.length === 0) return;
        ctx.strokeStyle = color || "black";
        ctx.lineWidth = width || 2;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
      });
    });

    // Other users drawing live
    socket.on("draw-start", ({ x, y, color, width }) => {
      ctx.strokeStyle = color || "black";
      ctx.lineWidth = width || 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
    });

    socket.on("draw-move", ({ x, y }) => {
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    socket.on("clear-canvas", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off("load-strokes");
      socket.off("draw-start");
      socket.off("draw-move");
      socket.off("clear-canvas");
    };
  }, [joined]);

  // --- Drawing Handlers ---
  const startDrawing = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);

    setCurrentStroke([{ x, y }]);
    socket.emit("draw-start", { room, x, y, color: "black", width: 2 });
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    const x = e.clientX;
    const y = e.clientY;
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    setCurrentStroke((prev) => [...prev, { x, y }]);
    socket.emit("draw-move", { room, x, y });
  };

  const stopDrawing = () => {
    if (!drawing) return;
    setDrawing(false);
    socket.emit("draw-end", {
      room,
      points: currentStroke,
      color: "black",
      width: 2,
    });
    setCurrentStroke([]);
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clear-canvas", room);
  };

  const joinRoom = () => {
    if (!room.trim()) return;
    socket.emit("join-room", room);
    setJoined(true);
  };

  return (
     <div className="app-root">
      <Whiteboard />
    </div>
  )  
}

export default App;
