package com.aiupskillingplatform.dto.roadmap.personalized;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionItemDTO {
    private String questionId;
    private String skillSlug;
    private String skillName;
    private String difficulty;
    private String questionText;
    private Boolean isCorrect;
}
