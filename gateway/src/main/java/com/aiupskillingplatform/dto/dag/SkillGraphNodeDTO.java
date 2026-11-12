
package com.aiupskillingplatform.dto.dag;

import java.util.UUID;

public record SkillGraphNodeDTO(
        UUID id,
        String name,
        String slug,
        String difficultyLevel,
        Integer sortOrder,
        String categoryName,
        String status,
        Double masteryScore
) {}
