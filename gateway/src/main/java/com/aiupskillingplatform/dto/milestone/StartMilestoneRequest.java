package com.aiupskillingplatform.dto.milestone;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StartMilestoneRequest {

    // Can be skill UUID or skill slug (e.g., "spring-framework-ioc")
    private String skillId;

    // Optional aliases/fallbacks
    private String skillSlug;
    private String nodeId;
}
