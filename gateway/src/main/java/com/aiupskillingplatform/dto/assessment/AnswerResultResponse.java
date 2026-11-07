package com.aiupskillingplatform.dto.assessment;

// Result of answer evaluation including explanation and next step
public record AnswerResultResponse(
        boolean correct,
        String correctAnswer,
        String explanation,
        AssessmentStepResponse next
) {}
