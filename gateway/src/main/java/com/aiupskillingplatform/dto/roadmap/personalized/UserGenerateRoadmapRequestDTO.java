package com.aiupskillingplatform.dto.roadmap.personalized;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserGenerateRoadmapRequestDTO {
    private String trackSlug;
    private String trackId;
    private String targetRole;
    private Integer studyHoursPerWeek;
    private String requestId;
}
