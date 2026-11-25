const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningResource",
      default: null
    },
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["video", "tutorial", "documentation", "article", "course", "project"],
      required: true
    },
    platform: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const skillAnalysisSchema = new mongoose.Schema(
  {
    skillSlug: { type: String, required: true, trim: true },
    name: { type: String, default: "", trim: true },
    categoryName: { type: String, default: "", trim: true },
    difficultyLevel: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["UNLOCKED", "LOCKED", "ASSESSED", "NOT_ASSESSED"],
      default: "NOT_ASSESSED"
    },
    masteryScore: { type: Number, default: null },
    confidence: { type: Number, default: null },
    evidenceCount: { type: Number, default: 0, min: 0 },
    priority: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "MEDIUM"
    }
  },
  { _id: false }
);

const topicSchema = new mongoose.Schema(
  {
    topicId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    points: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
      default: "NOT_STARTED"
    }
  },
  { _id: false }
);

const roadmapStepSchema = new mongoose.Schema(
  {
    stepId: { type: String, required: true },
    sequence: { type: Number, default: 1, min: 1 },
    category: { type: String, default: "", trim: true },
    title: { type: String, required: true },
    skill: { type: String, required: true },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"] },
    prerequisites: { type: [String], default: [] },
    estimatedHours: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
      default: "NOT_STARTED"
    },
    reason: { type: String, default: "" },
    topics: { type: [topicSchema], default: [] },
    project: {
      title: { type: String, default: "" },
      description: { type: String, default: "" }
    },
    resources: { type: [resourceSchema], default: [] }
  },
  { _id: false }
);

const assessmentQuestionSchema = new mongoose.Schema(
  {
    questionId: { type: String, default: null },
    skillSlug: { type: String, default: "", trim: true },
    skillName: { type: String, default: "", trim: true },
    difficulty: { type: String, default: "", trim: true },
    questionText: { type: String, default: "", trim: true },
    isCorrect: { type: Boolean, required: true }
  },
  { _id: false }
);

const assessmentSnapshotSchema = new mongoose.Schema(
  {
    assessmentId: { type: String, default: null },
    trackSlug: { type: String, default: "", trim: true },
    difficulty: { type: String, default: "", trim: true },
    totalQuestions: { type: Number, default: 0, min: 0 },
    correctCount: { type: Number, default: 0, min: 0 },
    wrongCount: { type: Number, default: 0, min: 0 },
    score: { type: Number, default: 0 },
    questions: { type: [assessmentQuestionSchema], default: [] }
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // Verified user UUID from Spring Boot
    trackId: { type: String, default: null, index: true }, // Track UUID from PostgreSQL Skill Graph
    targetRole: { type: String, required: true },
    assessmentRef: { type: String, default: null }, // Reference ID from PostgreSQL
    assessment: { type: assessmentSnapshotSchema, default: null }, // Graded assessment & question snapshot
    requestId: { type: String, default: null }, // Idempotency key per generation request
    studyHoursPerWeek: { type: Number, default: null, min: 1 },
    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVED"],
      default: "ACTIVE"
    },
    version: { type: Number, default: 1, min: 1 },
    percentComplete: { type: Number, default: 0, min: 0, max: 100 },
    generation: {
      model: { type: String, default: "" },
      promptVersion: { type: String, default: "" },
      createdAt: { type: Date, default: Date.now }
    },
    skillAnalysis: { type: [skillAnalysisSchema], default: [] },
    skillGaps: { type: [String], default: [] },
    steps: { type: [roadmapStepSchema], default: [] }
  },
  { timestamps: true, collection: "roadmaps" }
);

roadmapSchema.index({ userId: 1, trackId: 1, status: 1 });
roadmapSchema.index({ userId: 1, trackId: 1, version: -1 });
roadmapSchema.index(
  { userId: 1, requestId: 1 },
  {
    unique: true,
    partialFilterExpression: { requestId: { $type: "string" } }
  }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);
