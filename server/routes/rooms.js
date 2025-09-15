const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

router.post("/join", async (req, res) => {
  try {
    const { roomId } = req.body;
    if (!roomId) {
      return res.status(400).json({ error: "roomId required" });
    }

    let room = await Room.findOne({ roomId });
    if (!room) {
      room = await Room.create({ roomId });
    } else {
      room.lastActivity = Date.now();
      await room.save();
    }

    res.json({ ok: true, roomId: room.roomId });
  } catch (err) {
    console.error(" Error in /join:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
