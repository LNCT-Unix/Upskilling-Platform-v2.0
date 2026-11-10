package com.aiupskillingplatform.dto.dag;

import java.util.UUID;

public record SkillResponseDTO(
        UUID id,
        String name,
        String slug,
        String description,
        String difficultyLevel,
        Integer sortOrder,
        boolean active
) {}
