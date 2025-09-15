import React from "react";

export default function UserCursors({ cursors }) {
  return (
    <>
      {Object.entries(cursors).map(([id, { x, y, name, color }]) => (
        <div
          key={id}
          style={{
            position: "absolute",
            left: x + 8,
            top: y + 8,
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: color,
              border: "2px solid white",
              boxShadow: "0 0 2px rgba(0,0,0,0.5)",
            }}
          />
          <div
            style={{
              fontSize: 12,
              background: "rgba(0,0,0,0.6)",
              color: "white",
              padding: "2px 4px",
              borderRadius: 4,
              marginTop: 2,
            }}
          >
            {name}
          </div>
        </div>
      ))}
    </>
  );
}

