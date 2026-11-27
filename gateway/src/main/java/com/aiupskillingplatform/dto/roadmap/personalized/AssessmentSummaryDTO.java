package com.aiupskillingplatform.dto.roadmap.personalized;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentSummaryDTO {
    private String assessmentId;
    private String trackSlug;
    private String difficulty;
    private Integer totalQuestions;
    private Integer correctCount;
    private Integer wrongCount;
    private Double score;
}
