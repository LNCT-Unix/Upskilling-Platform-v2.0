package com.aiupskillingplatform.dto.roadmap;

import java.util.List;

public record CategoryDTO(
        Integer id,
        String title,
        List<StepDTO> steps
) {}
