function isNonEmptyString(val) {
  return typeof val === "string" && val.trim().length > 0;
}

function validateRoadmapRequest(req, res, next) {
  const {
    userId,
    targetRole,
    skills,
    questions,
    assessment,
    trackId,
    requestId,
    studyHoursPerWeek,
    dependencies
  } = req.body || {};

  if (
    userId === undefined ||
    userId === null ||
    (typeof userId !== "string" && typeof userId !== "number") ||
    !String(userId).trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid userId is required"
    });
  }

  if (!isNonEmptyString(targetRole)) {
    return res.status(400).json({
      success: false,
      message: "Target role must be a non-empty string"
    });
  }

  const hasQuestions = Array.isArray(questions) && questions.length > 0;
  const hasSkills = Array.isArray(skills) && skills.length > 0;

  if (!hasQuestions && !hasSkills) {
    return res.status(400).json({
      success: false,
      message: "At least one of questions or skills must be a non-empty array"
    });
  }

  if (questions !== undefined) {
    if (!Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: "questions must be an array"
      });
    }
    const validQuestions = questions.every(
      (q) =>
        q &&
        typeof q === "object" &&
        typeof q.isCorrect === "boolean" &&
        (isNonEmptyString(q.skillSlug) || isNonEmptyString(q.questionText))
    );
    if (!validQuestions) {
      return res.status(400).json({
        success: false,
        message: "Each question must include boolean isCorrect and skillSlug or questionText"
      });
    }
  }

  if (skills !== undefined) {
    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: "skills must be an array"
      });
    }
    const validSkills = skills.every(
      (s) =>
        s &&
        typeof s === "object" &&
        (isNonEmptyString(s.skillSlug) || isNonEmptyString(s.name))
    );
    if (!validSkills) {
      return res.status(400).json({
        success: false,
        message: "Each skill must include skillSlug or name"
      });
    }
  }

  if (trackId !== undefined && trackId !== null && !isNonEmptyString(trackId)) {
    return res.status(400).json({
      success: false,
      message: "trackId must be a non-empty string"
    });
  }

  if (requestId !== undefined && requestId !== null && !isNonEmptyString(requestId)) {
    return res.status(400).json({
      success: false,
      message: "requestId must be a non-empty string"
    });
  }

  if (
    studyHoursPerWeek !== undefined &&
    studyHoursPerWeek !== null &&
    (typeof studyHoursPerWeek !== "number" ||
      !Number.isFinite(studyHoursPerWeek) ||
      studyHoursPerWeek < 1)
  ) {
    return res.status(400).json({
      success: false,
      message: "studyHoursPerWeek must be a number >= 1"
    });
  }

  if (
    assessment !== undefined &&
    assessment !== null &&
    (typeof assessment !== "object" || Array.isArray(assessment))
  ) {
    return res.status(400).json({
      success: false,
      message: "assessment must be an object"
    });
  }

  if (dependencies !== undefined && dependencies !== null) {
    const validDeps =
      Array.isArray(dependencies) &&
      dependencies.every(
        (d) =>
          d &&
          typeof d === "object" &&
          isNonEmptyString(d.prerequisite) &&
          isNonEmptyString(d.dependent)
      );
    if (!validDeps) {
      return res.status(400).json({
        success: false,
        message: "dependencies must be an array of { prerequisite, dependent } strings"
      });
    }
  }

  next();
}

function requireUserId(req, res, next) {
  const rawUserId =
    req.query?.userId ?? req.body?.userId ?? req.headers["x-user-id"];

  if (
    rawUserId === undefined ||
    rawUserId === null ||
    (typeof rawUserId !== "string" && typeof rawUserId !== "number") ||
    !String(rawUserId).trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid userId is required"
    });
  }

  req.userId = String(rawUserId).trim();
  next();
}

module.exports = {
  validateRoadmapRequest,
  requireUserId
};