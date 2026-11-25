const generateRoadmap = require("../services/aiService.js");

async function createRoadmap(req, res) {
  try {
    const { userId, skills, targetRole, assessmentRef } = req.body;

    const roadmap = await generateRoadmap(
      String(userId),
      skills,
      targetRole,
      assessmentRef || null
    );
 
    return res.status(201).json({
      success: true,
      data: roadmaps
    });
  } catch (error) {
    console.error("Create roadmap error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate roadmap"
    });
  }
}

module.exports = { createRoadmap };