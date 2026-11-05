package com.aiupskillingplatform.dto.assessment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentQuestionResponseDTO {

    @JsonProperty("questionIndex")
    private Integer questionIndex;

    @JsonProperty("questionNumber")
    private Integer questionNumber;

    @JsonProperty("totalQuestions")
    private Integer totalQuestions;

    @JsonProperty("isCompleted")
    private boolean isCompleted;

    private AssessmentSkillDTO skill;

    private QuestionDTO question;

    private String message;
}

