const express = require("express");
const router = express.Router();
const { validateRoadmapRequest, requireUserId } = require("../middlewares/validateRoadmapRequest.js");
const { createRoadmap,getRoadmap,getRoadmapHistory , updateRoadmapProgress} = require("../controllers/roadmapController.js");
const verifyInternalAuth = require("../middlewares/verifyInternalAuth.js");


router.post("/generate", validateRoadmapRequest, createRoadmap);
router.get("/me" ,requireUserId,getRoadmap )
router.get("/me/history" , requireUserId, getRoadmapHistory)
router.patch("/:roadmapId/progress", requireUserId, updateRoadmapProgress);

module.exports = router;