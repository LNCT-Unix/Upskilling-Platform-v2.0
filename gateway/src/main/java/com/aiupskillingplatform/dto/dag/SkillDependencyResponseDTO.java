package com.aiupskillingplatform.dto.dag;

import java.util.UUID;

public record SkillDependencyResponseDTO(
        UUID id,
        UUID prerequisiteSkillId,
        String prerequisiteSkillName,
        UUID dependentSkillId,
        String dependentSkillName
) {}
