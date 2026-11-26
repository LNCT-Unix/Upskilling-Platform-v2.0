const mongoose = require("mongoose");

const learningResourceSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    url: { type: String, required: true, unique: true },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true
    },
    prerequisites: { type: [String], default: [] },
    type: {
      type: String,
      enum: ["documentation", "course", "article", "video", "project"],
      default: "documentation"
    },
    embedding: { type: [Number], default: [] }
  },
  { timestamps: true, collection: "learning_resources" }
);

module.exports = mongoose.model("LearningResource", learningResourceSchema);