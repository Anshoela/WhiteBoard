import React, { useRef, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function DrawingCanvas({ socket, room, strokeWidth, userColor }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [drawing, setDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState([]);

  const [userId] = useState(() => uuidv4());
  const [userName] = useState(() => "User-" + userId.slice(0, 4));

  useEffect(() => {
    if (!room) return;

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = userColor;
    ctx.lineWidth = strokeWidth;
    ctxRef.current = ctx;

    // --- Remote strokes ---
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

    socket.on("draw-start", ({ x, y, color, width }) => {
      ctx.strokeStyle = color || "black";
      ctx.lineWidth = width || 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
    });

    socket.on("draw-move", ({ x, y, color, width }) => {
      ctx.strokeStyle = color || "black";
      ctx.lineWidth = width || 2;
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
  }, [room, socket]);

  // ✅ Whenever strokeWidth or color changes, update ctxRef
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = userColor;
      ctxRef.current.lineWidth = strokeWidth;
    }
  }, [userColor, strokeWidth]);

  // --- Local Drawing ---
  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    ctxRef.current.strokeStyle = userColor;
    ctxRef.current.lineWidth = strokeWidth;

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);

    setCurrentStroke([{ x: offsetX, y: offsetY }]);

    socket.emit("draw-start", {
      room,
      x: offsetX,
      y: offsetY,
      color: userColor,
      width: strokeWidth,
    });

    setDrawing(true);
  };

  const draw = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    // normalize cursor positions
    const xNorm = offsetX / canvasRef.current.width;
    const yNorm = offsetY / canvasRef.current.height;
    socket.emit("cursor-move", { room, userId, xNorm, yNorm, name: userName, color: userColor });

    if (!drawing) return;

    ctxRef.current.strokeStyle = userColor;
    ctxRef.current.lineWidth = strokeWidth;

    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();

    setCurrentStroke((prev) => [...prev, { x: offsetX, y: offsetY }]);

    socket.emit("draw-move", { room, x: offsetX, y: offsetY, color: userColor, width: strokeWidth });
  };

  const stopDrawing = () => {
    if (!drawing) return;
    setDrawing(false);

    socket.emit("draw-end", {
      room,
      points: currentStroke,
      color: userColor,
      width: strokeWidth,
    });

    setCurrentStroke([]);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      style={{
        border: "1px solid #ccc",
        display: "block",
        width: "100%",
        height: "100vh",
      }}
    />
  );
}
