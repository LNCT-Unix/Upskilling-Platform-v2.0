package com.aiupskillingplatform.dto.milestone;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StartMilestoneResponse {

    private String attemptId;
    private String skillId;
    private String skillSlug;
    private String skillName;
    private String nodeId;
    private Integer attemptNumber;
    private Integer totalQuestions;
    private String status;
}
