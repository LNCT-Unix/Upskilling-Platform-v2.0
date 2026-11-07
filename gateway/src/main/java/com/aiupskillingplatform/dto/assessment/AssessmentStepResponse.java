package com.aiupskillingplatform.dto.assessment;

// Assessment progress step containing current question and skill details
public record AssessmentStepResponse(
        int questionIndex,
        int questionNumber,
        int totalQuestions,
        boolean completed,
        AssessmentSkillDTO skill,
        AssessmentQuestionDTO question,
        String message
) {}
