const mongoose = require("mongoose");

const roadmapProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
      index: true
    },
    completedStepIds: { type: [String], default: [] },
    completedResourceIds: { type: [String], default: [] },
    percentComplete: { type: Number, default: 0, min: 0, max: 100 }
  },
  { timestamps: true, collection: "roadmap_progress" }
);

roadmapProgressSchema.index({ userId: 1, roadmapId: 1 }, { unique: true });

module.exports = mongoose.model("RoadmapProgress", roadmapProgressSchema);