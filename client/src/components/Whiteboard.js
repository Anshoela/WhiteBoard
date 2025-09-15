import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Toolbar from "./Toolbar";
import RoomJoin from "./RoomJoin";
import DrawingCanvas from "./DrawingCanvas";
import UserCursors from "./UserCursor";

const socket = io("http://localhost:5000");

export default function Whiteboard() {
  const [room, setRoom] = useState(null);
  const [joined, setJoined] = useState(false);
  const [cursors, setCursors] = useState({});
  const [strokeWidth, setStrokeWidth] = useState(2); // slider state
  const [userColor, setUserColor] = useState("#000000");
  const [userCount, setUserCount] = useState(0);

  const joinRoom = (roomId) => {
    setRoom(roomId);
    setJoined(true);
    socket.emit("join-room", roomId);
  };

  const clearBoard = () => {
    socket.emit("clear-canvas", room);
  };

  // listen for remote cursor moves
  useEffect(() => {
    if (!joined) return;

    const handleCursorMove = ({ userId, xNorm, yNorm, name, color }) => {
      const canvas = document.querySelector("canvas");
      if (!canvas) return;
      const x = xNorm * canvas.width;
      const y = yNorm * canvas.height;

      setCursors((prev) => ({
        ...prev,
        [userId]: { x, y, name, color, lastSeen: Date.now() },
      }));
    };

    socket.on("cursor-move", handleCursorMove);

    // cleanup old cursors every 5s
    const tid = setInterval(() => {
      const now = Date.now();
      setCursors((prev) => {
        const copy = { ...prev };
        Object.keys(copy).forEach((id) => {
          if (now - copy[id].lastSeen > 6000) delete copy[id];
        });
        return copy;
      });
    }, 5000);

    return () => {
      socket.off("cursor-move", handleCursorMove);
      clearInterval(tid);
    };
  }, [joined]);

  useEffect(() => {
  if (!joined) return;

  socket.on("user-count", ({ roomId, count }) => {
    setUserCount(count);
  });

  return () => {
    socket.off("user-count");
  };
}, [joined]);


  return (
    <div>
      {!joined ? (
        <RoomJoin onJoin={joinRoom} />
      ) : (
        <div style={{ position: "relative" }}>

<DrawingCanvas socket={socket} room={room} strokeWidth={strokeWidth} userColor={userColor} />
<Toolbar
  onClear={clearBoard}
  strokeWidth={strokeWidth}
  setStrokeWidth={setStrokeWidth}
  userColor={userColor}
  setUserColor={setUserColor}
/>
<UserCursors cursors={cursors} />
<div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
  <h3>Room: {room}</h3>
  <p>Users Online: {userCount}</p>
</div>

        </div>
      )}
    </div>
  );
}
