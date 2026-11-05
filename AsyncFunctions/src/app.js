const express = require("express");
require("dotenv").config();

const app = express();

const generateSkillGraph = require("./services/aiService.js");
const validateSkillGraph = require("./middlewares/validateSkillGraph.js");

app.use(express.json());

app.use((req, res,next) => {
    console.log("Request received");
    next();
});

app.get("/", (req, res) => {
    res.send("Hello World");
});



 app.post("/api/skill-graph",validateSkillGraph, async (req, res) => {
    try {
        const { skills, targetRole } = req.body;
            
        const aiResponse = await generateSkillGraph(
            skills,
            targetRole
        );
        

        return res.status(200).json({
            success: true,
            data: aiResponse
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate skill graph"
        });
    }
});
 


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});