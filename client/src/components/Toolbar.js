import React from "react";

export default function Toolbar({ onClear, strokeWidth, setStrokeWidth, userColor, setUserColor }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        background: "rgba(255,255,255,0.9)",
        padding: "8px",
        borderRadius: "6px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <button
        onClick={onClear}
        style={{
          padding: "6px 12px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Clear
      </button>

      {/* Stroke width slider */}
      <label style={{ fontSize: 14 }}>Stroke:</label>
      <input
        type="range"
        min="1"
        max="20"
        value={strokeWidth}
        onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
      />
      <span>{strokeWidth}px</span>

      <label style={{ fontSize: 14 }}>Color:</label>
      <input
        type="color"
        value={userColor}
        onChange={(e) => setUserColor(e.target.value)}
      />
    </div>
  );
}
