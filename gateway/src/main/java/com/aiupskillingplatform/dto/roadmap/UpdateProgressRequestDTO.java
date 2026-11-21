package com.aiupskillingplatform.dto.roadmap;

import jakarta.validation.constraints.NotNull;

public record UpdateProgressRequestDTO(
        @NotNull(message = "done must not be null")
        Boolean done
) {}
