package com.aiupskillingplatform.dto.dag;

import java.util.List;
import java.util.UUID;

public record RoadmapResponseDTO(
        UUID roadmapId,
        UUID skillId,
        String skillName,
        String skillSlug,
        String title,
        String description,
        Integer version,
        List<RoadmapNodeResponseDTO> nodes
) {}
