package com.aiupskillingplatform.dto.dag;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record SkillDependencyRequestDTO(
        @NotNull(message = "Prerequisite skill ID is required")
        UUID prerequisiteSkillId,

        @NotNull(message = "Dependent skill ID is required")
        UUID dependentSkillId
) {}
