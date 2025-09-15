import React, { useState } from "react";
import "./RoomJoin.css";

export default function RoomJoin({ onJoin }) {
  const [code, setCode] = useState("");

  const handleJoin = () => {
    if (!code) {
      alert("Please enter a room code.");
      return;
    }
    if (code.length > 8) {
      alert("Room code must not be longer than 8 characters.");
      return;
    }
    onJoin(code);
  };

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter room code"
        style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: "4px" }}
      />
      <button
        onClick={handleJoin}
        style={{
          padding: "6px 12px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Join
      </button>
    </div>
  );
}
