const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalImage: {
      type: String,
      required: true,
    },

    enhancedImage: {
      type: String,
      required: true,
    },

    enhancementType: {
      type: String,
      enum: [
        "AI Enhance",
        "Upscale",
        "Sharpen",
        "Color Enhance",
      ],
      default: "AI Enhance",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "History",
  historySchema
);