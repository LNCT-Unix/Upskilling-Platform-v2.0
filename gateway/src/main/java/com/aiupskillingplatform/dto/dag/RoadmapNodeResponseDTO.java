package com.aiupskillingplatform.dto.dag;

import java.util.UUID;

public record RoadmapNodeResponseDTO(
        UUID id,
        UUID parentNodeId,
        String title,
        String description,
        String slug,
        Integer sequenceOrder,
        Object prerequisites,
        Object resources
) {
}
