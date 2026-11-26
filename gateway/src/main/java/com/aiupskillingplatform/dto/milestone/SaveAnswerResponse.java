package com.aiupskillingplatform.dto.milestone;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaveAnswerResponse {

    private String attemptId;
    private String questionId;
    private String selectedAnswer;
    private Boolean saved;
}
