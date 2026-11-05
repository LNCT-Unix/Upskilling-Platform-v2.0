function validateSkillGraph(req, res, next) {
    const { skills, targetRole } = req.body;

    if (!skills || !targetRole) {
        return res.status(400).json({
            success: false,
            message: "Skills and target role required"
        });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Skills must be a non-empty array"
        });
    }

    if (typeof targetRole !== "string" || !targetRole.trim()) {
        return res.status(400).json({
            success: false,
            message: "Target role must be a non-empty string"
        });
    }

    next();
}

module.exports=validateSkillGraph;