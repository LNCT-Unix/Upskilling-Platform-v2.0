package com.aiupskillingplatform.dto.dag;

import java.util.UUID;

public record SkillGraphEdgeDTO(
        UUID prerequisiteSkillId,
        UUID dependentSkillId
) {}
