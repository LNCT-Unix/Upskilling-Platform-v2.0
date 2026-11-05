package com.aiupskillingplatform.dto.dag;

import java.util.List;
import java.util.UUID;

public record SkillGraphNodeDTO(
        UUID id,
        String name,
        String slug,
        String difficultyLevel,
        Integer sortOrder,
        String categoryName,
        String status,
        Double masteryScore,
        List<String> prerequisiteNames
) {}
