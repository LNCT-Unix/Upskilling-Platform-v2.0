package com.aiupskillingplatform.dto.roadmap;

import java.util.List;

public record TopicDTO(
        String id,
        String name,
        List<String> points
) {}
