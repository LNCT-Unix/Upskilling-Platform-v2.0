package com.aiupskillingplatform.dto.milestone;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetMilestoneResponse {

    private String attemptId;
    private String status;
    private Integer totalQuestions;
    private List<MilestoneQuestionDTO> questions;
}
