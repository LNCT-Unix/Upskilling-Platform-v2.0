package com.aiupskillingplatform.dto.roadmap;

import java.util.List;

public record StepDTO(
        Integer id,
        String title,
        List<TopicDTO> topics
) {}
