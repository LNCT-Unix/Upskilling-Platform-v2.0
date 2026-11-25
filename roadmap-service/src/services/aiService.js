const { GoogleGenAI, Type } = require("@google/genai");
const Roadmap = require("../models/Roadmap.js");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL_NAME = process.env.GEMINI_MODEL ;
const PROMPT_VERSION = process.env.PROMPT_VERSION || "roadmap-v1";
const AI_TIMEOUT_MS = 45000;

const roadmapResponseSchema = {
  type: Type.OBJECT,
  properties: {
    skillGaps: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepId: { type: Type.STRING },
          sequence: { type: Type.INTEGER },
          category: { type: Type.STRING },
          title: { type: Type.STRING },
          skill: { type: Type.STRING },
          level: {
            type: Type.STRING,
            enum: ["beginner", "intermediate", "advanced"]
          },
          prerequisites: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          estimatedHours: { type: Type.NUMBER },
          reason: { type: Type.STRING },
          topics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topicId: { type: Type.STRING },
                name: { type: Type.STRING },
                points: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["topicId", "name", "points"]
            }
          },
          project: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["title", "description"]
          },
          resources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                url: { type: Type.STRING },
                type: {
                  type: Type.STRING,
                  enum: ["video", "tutorial", "documentation", "article", "course", "project"]
                },
                platform: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["title", "url", "type", "platform", "description"]
            }
          }
        },
        required: [
          "stepId",
          "sequence",
          "category",
          "title",
          "skill",
          "level",
          "prerequisites",
          "estimatedHours",
          "reason",
          "topics",
          "project",
          "resources"
        ]
      }
    }
  },
  required: ["skillGaps", "steps"]
};

function createAiError(message) {
  const err = new Error(message);
  err.statusCode = 502;
  return err;
}

function isValidHttpsUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function validateAndSanitizeRoadmap(parsed, dependencies = []) {
  if (!parsed || !Array.isArray(parsed.steps) || parsed.steps.length === 0) {
    throw createAiError("AI returned an empty roadmap");
  }

  const seenStepIds = new Set();
  const seenTopicIds = new Set();
  const skillIndexMap = new Map();

  const sanitizedSteps = parsed.steps.map((step, index) => {
    const stepId = typeof step.stepId === "string" ? step.stepId.trim() : "";
    if (!stepId || seenStepIds.has(stepId)) {
      throw createAiError("AI returned missing or duplicate stepId");
    }
    seenStepIds.add(stepId);

    const estimatedHours = Number(step.estimatedHours);
    if (!Number.isFinite(estimatedHours) || estimatedHours < 0) {
      throw createAiError(`Invalid estimatedHours on step ${stepId}`);
    }

    const topics = Array.isArray(step.topics)
      ? step.topics.map((topic, tIdx) => {
          const topicId =
            typeof topic.topicId === "string" && topic.topicId.trim()
              ? topic.topicId.trim()
              : `${stepId}-${tIdx}`;
          if (seenTopicIds.has(topicId)) {
            throw createAiError(`Duplicate topicId: ${topicId}`);
          }
          seenTopicIds.add(topicId);

          return {
            topicId,
            name: String(topic.name || "").trim(),
            points: Array.isArray(topic.points)
              ? topic.points.map((p) => String(p).trim()).filter(Boolean)
              : [],
            status: "NOT_STARTED"
          };
        })
      : [];

    const validResources = Array.isArray(step.resources)
      ? step.resources
          .filter((r) => r && typeof r.url === "string" && isValidHttpsUrl(r.url.trim()))
          .map((r) => ({
            resourceId: null,
            title: String(r.title || "").trim(),
            url: r.url.trim(),
            type: r.type,
            platform: String(r.platform || "").trim(),
            description: String(r.description || "").trim()
          }))
      : [];

    if (validResources.length === 0) {
      throw createAiError(`Step ${stepId} has no valid https:// resources`);
    }

    const skillSlug = String(step.skill || "").trim();
    if (skillSlug && !skillIndexMap.has(skillSlug)) {
      skillIndexMap.set(skillSlug, index);
    }

    return {
      stepId,
      sequence: Number.isInteger(step.sequence) && step.sequence >= 1 ? step.sequence : index + 1,
      category: String(step.category || "").trim(),
      title: String(step.title || "").trim(),
      skill: skillSlug,
      level: step.level,
      prerequisites: Array.isArray(step.prerequisites)
        ? step.prerequisites.map((p) => String(p).trim()).filter(Boolean)
        : [],
      estimatedHours,
      status: "NOT_STARTED",
      reason: String(step.reason || "").trim(),
      topics,
      project: {
        title: String(step.project?.title || "").trim(),
        description: String(step.project?.description || "").trim()
      },
      resources: validResources
    };
  });

  // Verify prerequisite ordering against dependencies
  for (const dep of dependencies) {
    const prereqIdx = skillIndexMap.get(dep.prerequisite);
    const depIdx = skillIndexMap.get(dep.dependent);
    if (prereqIdx !== undefined && depIdx !== undefined && prereqIdx > depIdx) {
      throw createAiError(
        `Invalid prerequisite order: ${dep.prerequisite} must come before ${dep.dependent}`
      );
    }
  }

  return {
    skillGaps: Array.isArray(parsed.skillGaps)
      ? parsed.skillGaps.map((g) => String(g).trim()).filter(Boolean)
      : [],
    steps: sanitizedSteps
  };
}

function buildSkillAnalysis(skills = [], questions = []) {
  const questionStats = new Map();
  for (const q of questions) {
    if (!q.skillSlug) continue;
    const entry = questionStats.get(q.skillSlug) || { total: 0, wrong: 0, name: q.skillName || "" };
    entry.total += 1;
    if (!q.isCorrect) entry.wrong += 1;
    questionStats.set(q.skillSlug, entry);
  }

  if (skills.length > 0) {
    return skills.map((s) => {
      const stats = questionStats.get(s.skillSlug);
      const priority =
        s.status === "LOCKED" || (stats && stats.wrong > 0)
          ? "HIGH"
          : s.status === "NOT_ASSESSED"
          ? "MEDIUM"
          : "LOW";

      return {
        skillSlug: s.skillSlug,
        name: s.name || stats?.name || "",
        categoryName: s.categoryName || "",
        difficultyLevel: s.difficultyLevel || "",
        status: s.status || "NOT_ASSESSED",
        masteryScore: s.masteryScore ?? null,
        confidence: s.confidence ?? null,
        evidenceCount: stats ? stats.total : 0,
        priority
      };
    });
  }

  return Array.from(questionStats.entries()).map(([skillSlug, stats]) => ({
    skillSlug,
    name: stats.name,
    categoryName: "",
    difficultyLevel: "",
    status: "ASSESSED",
    masteryScore: stats.total > 0 ? (stats.total - stats.wrong) / stats.total : null,
    confidence: null,
    evidenceCount: stats.total,
    priority: stats.wrong > 0 ? "HIGH" : "LOW"
  }));
}

async function generateRoadmap({
  userId,
  trackId = null,
  assessmentRef = null,
  requestId = null,
  targetRole,
  studyHoursPerWeek = null,
  assessment = null,
  questions = [],
  skills = [],
  dependencies = []
}) {
  const prompt = `
You are an expert technical career mentor.
Create a personalized, prerequisite-ordered learning roadmap.

Target Role: ${targetRole}
Study Hours Per Week: ${studyHoursPerWeek ?? "Not specified"}
Assessment Summary: ${JSON.stringify(assessment)}
Graded Questions: ${JSON.stringify(questions)}
Skill Graph Status: ${JSON.stringify(skills)}
Skill Dependencies: ${JSON.stringify(dependencies)}

Rules:
- Identify missing or weak skills (e.g. wrong answers or LOCKED skills) as "skillGaps".
- Do NOT treat "NOT_ASSESSED" skills as weak or failed.
- Order "steps" from foundational prerequisites to advanced topics, strictly respecting Skill Dependencies.
- Use sequential stepIds ("step-1", "step-2", ...) and topicIds ("step-1-0", "step-1-1", ...).
- Include 2-3 "topics" per step, each with concise bullet "points".
- Include 2-3 "resources" per step mixing "documentation", "video", and "tutorial" with real, working "https://" URLs (no placeholder or example.com URLs).
- In "reason", briefly explain why this step matters for ${targetRole} given the learner's assessment results.
`;

  let response;
  try {
    response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        abortSignal: AbortSignal.timeout(AI_TIMEOUT_MS),
        responseMimeType: "application/json",
        responseSchema: roadmapResponseSchema
      }
    });
  } catch (err) {
    throw createAiError("AI roadmap generation failed or timed out");
  }

  let parsed;
  try {
    parsed = JSON.parse(response.text);
  } catch {
    throw createAiError("AI returned malformed JSON");
  }

  const { skillGaps, steps } = validateAndSanitizeRoadmap(parsed, dependencies);
  const skillAnalysis = buildSkillAnalysis(skills, questions);

  const versionFilter = trackId ? { userId, trackId } : { userId, targetRole };
  const latest = await Roadmap.findOne(versionFilter).sort({ version: -1 });
  const nextVersion = latest ? latest.version + 1 : 1;

  const assessmentSnapshot =
    assessment || questions.length > 0
      ? { ...(assessment || {}), questions }
      : null;

  const savedRoadmap = await Roadmap.create({
    userId,
    trackId,
    targetRole,
    assessmentRef,
    assessment: assessmentSnapshot,
    requestId,
    studyHoursPerWeek,
    status: "ACTIVE",
    version: nextVersion,
    percentComplete: 0,
    generation: {
      model: MODEL_NAME,
      promptVersion: PROMPT_VERSION,
      createdAt: new Date()
    },
    skillAnalysis,
    skillGaps,
    steps
  });

  await Roadmap.updateMany(
    { ...versionFilter, status: "ACTIVE", _id: { $ne: savedRoadmap._id } },
    { $set: { status: "ARCHIVED" } }
  );

  return savedRoadmap;
}

module.exports = generateRoadmap;