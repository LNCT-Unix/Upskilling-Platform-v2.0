package com.aiupskillingplatform.dto.roadmap.personalized;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenerateRoadmapPayloadDTO {
    private String requestId;
    private String userId;
    private String trackId;
    private String assessmentRef;
    private String targetRole;
    private Integer studyHoursPerWeek;
    private AssessmentSummaryDTO assessment;
    private List<QuestionItemDTO> questions;
    private List<SkillItemDTO> skills;
    private List<DependencyItemDTO> dependencies;
}
