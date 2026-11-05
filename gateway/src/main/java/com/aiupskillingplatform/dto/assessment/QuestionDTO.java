package com.aiupskillingplatform.dto.assessment;

import java.util.UUID;

public record QuestionDTO(
        UUID id,
        String questionText,
        String questionType,
        Object options,
        String difficulty,
        String correctAnswer,
        String explanation
) {}

