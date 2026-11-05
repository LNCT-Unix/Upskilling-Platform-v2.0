package com.aiupskillingplatform.dto.assessment;

import java.util.UUID;

public record AssessmentSkillDTO(
        UUID id,
        String name,
        String slug,
        String categoryName,
        UUID categoryId,
        String status
) {}

