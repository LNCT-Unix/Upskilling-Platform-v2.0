package com.aiupskillingplatform.dto.dag;

import java.util.List;
import java.util.UUID;

public record SkillGraphResponseDTO(
        UUID trackId,
        List<SkillGraphNodeDTO> nodes,
        List<SkillGraphEdgeDTO> edges
) {}
