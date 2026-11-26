package com.aiupskillingplatform.dto.milestone;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MilestoneQuestionDTO {

    private String questionId;
    private Integer questionOrder;
    private String questionText;
    private Map<String, String> options;
    private String selectedAnswer;
}
