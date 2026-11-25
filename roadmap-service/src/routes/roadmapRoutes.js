const express = require("express");
const router = express.Router();
const validateRoadmapRequest = require("../middlewares/validateRoadmapRequest.js");
const { createRoadmap } = require("../controllers/roadmapController.js");


router.post("/generate", validateRoadmapRequest, createRoadmap);


module.exports = router;