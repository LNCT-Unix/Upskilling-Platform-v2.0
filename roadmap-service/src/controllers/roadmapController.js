const generateRoadmap = require("../services/aiService.js");
const mongoose=require("mongoose");
const Roadmap=require("../models/Roadmap.js");

const ALLOWED_STATUSES = new Set(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]);

async function createRoadmap(req, res) {
  try {
    const { requestId, userId, trackId, assessmentRef, targetRole, studyHoursPerWeek, assessment, questions, skills, dependencies } = req.body;

    const normalizedUserId = String(userId).trim();
    const normalizedRequestId = requestId ? String(requestId).trim() : null ;


    if(normalizedRequestId){
      
  const existing = await Roadmap.findOne({
  userId: normalizedUserId,
  requestId: normalizedRequestId
});

if (existing) {
  return res.status(200).json(
    { success: true, data: existing });
}
    }
   const roadmap = await generateRoadmap({
  userId: normalizedUserId,
  trackId: trackId || null,
  assessmentRef: assessmentRef || null,
  requestId: normalizedRequestId,
  targetRole,
  studyHoursPerWeek: studyHoursPerWeek ?? null,
  assessment: assessment || null,
  questions: questions || [],
  skills: skills || [],
  dependencies: dependencies || []
});
 
    return res.status(201).json({
      success: true,
      data: roadmap
    });
  } catch (error) {
    console.error("Create roadmap error:", error);
 if(error.statusCode===502 ){
  return res.status(502).json({
      success: false,
      message: error.message
    });
 }

    return res.status(500).json({
      success: false,
      message: "Failed to generate roadmap"
    });
  }
}


//get Roadmap
async function getRoadmap(req,res){
   try{
        const filter = { userId: req.userId, status: "ACTIVE" };
if (req.query.trackId){
   filter.trackId = String(req.query.trackId).trim();
}
const roadmap = await Roadmap.findOne(filter).sort({ version: -1 });

if(!roadmap){
     return res.status(404).json({
      success: false,
      message: "No active Roadmap found"
    })
    }
    return res.status(200).json({
        success:true,
        data:roadmap
    })
  }catch(err){
        console.log(err)
         return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
    }}


    //get roadmapHistory

async function getRoadmapHistory(req,res){
  try{
 const filter = { userId: req.userId };
  if (req.query.trackId) filter.trackId = String(req.query.trackId).trim();
    const roadmaps = await Roadmap.find(filter).sort({ version: -1 });

    return res.status(200).json({
        success:true,
        data:roadmaps
    })
  
    }catch(err){
        console.log(err)
         return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
}
}




// update roadmap progress
async function updateRoadmapProgress(req, res) {
  try {
    const { roadmapId } = req.params;
    const { stepId, topicId, status } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ success: false, message: "Invalid roadmapId" });
    }

    if (typeof stepId !== "string" || !stepId.trim()) {
      return res.status(400).json({ success: false, message: "Valid stepId is required" });
    }

    if (!ALLOWED_STATUSES.has(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be NOT_STARTED, IN_PROGRESS, or COMPLETED"
      });
    }

    // Ownership isolation: only match if both _id and userId match
    const roadmap = await Roadmap.findOne({ _id: roadmapId, userId: req.userId });
    if (!roadmap) {
      return res.status(404).json({ success: false, message: "Roadmap not found" });
    }

    const step = roadmap.steps.find((s) => s.stepId === stepId.trim());
    if (!step) {
      return res.status(404).json({ success: false, message: "Step not found" });
    }

    if (topicId !== undefined && topicId !== null && String(topicId).trim()) {
      const topic = step.topics.find((t) => t.topicId === String(topicId).trim());
      if (!topic) {
        return res.status(404).json({ success: false, message: "Topic not found" });
      }
      topic.status = status;

      // Derive parent step status from its topics
      const allCompleted = step.topics.every((t) => t.status === "COMPLETED");
      const allNotStarted = step.topics.every((t) => t.status === "NOT_STARTED");
      step.status = allCompleted ? "COMPLETED" : allNotStarted ? "NOT_STARTED" : "IN_PROGRESS";
    } else {
      step.status = status;
    }

    // Recalculate overall percentComplete across all steps/topics
    let totalUnits = 0;
    let completedUnits = 0;
    for (const s of roadmap.steps) {
      if (Array.isArray(s.topics) && s.topics.length > 0) {
        totalUnits += s.topics.length;
        completedUnits += s.topics.filter((t) => t.status === "COMPLETED").length;
      } else {
        totalUnits += 1;
        if (s.status === "COMPLETED") completedUnits += 1;
      }
    }
    roadmap.percentComplete = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

    await roadmap.save();
    return res.status(200).json({ success: true, data: roadmap });
  } catch (err) {
    console.error("Update progress error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}


module.exports = { createRoadmap ,getRoadmap, getRoadmapHistory, updateRoadmapProgress};