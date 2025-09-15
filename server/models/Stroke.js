const mongoose = require("mongoose");

const strokeSchema = new mongoose.Schema(
  {
    room: { type: String, index: true },
    color: { type: String, default: "#000000" },
    width: { type: Number, default: 2 },
    points: [
      {
        x: Number,
        y: Number,
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stroke", strokeSchema);
