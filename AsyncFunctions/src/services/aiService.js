async function generateSkillGraph(skills, targetRole) {
    const missingSkills = ["Docker", "System Design"];

    const roadmap = [
        {
            skill: "Docker",
            priority: "High"
        },
        {
            skill: "System Design",
            priority: "Medium"
        }
    ];

    return {
        targetRole: targetRole,
        currentSkills: skills,
        missingSkills: missingSkills,
        roadmap: roadmap
    };
}

module.exports = generateSkillGraph;