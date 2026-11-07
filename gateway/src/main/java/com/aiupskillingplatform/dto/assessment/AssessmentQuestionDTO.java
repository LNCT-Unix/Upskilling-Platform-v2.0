package com.aiupskillingplatform.dto.assessment;

import java.util.UUID;

// Question payload sent to user without correct answer or explanation
public record AssessmentQuestionDTO(
        UUID id,
        String text,
        String type,
        Object options,
        String difficulty
) {}

