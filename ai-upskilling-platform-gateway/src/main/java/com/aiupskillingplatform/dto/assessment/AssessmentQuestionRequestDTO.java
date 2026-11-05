package com.aiupskillingplatform.dto.assessment;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentQuestionRequestDTO {

    @JsonProperty("correct_ans")
    @JsonAlias({"correctAns", "correctAnswer", "correct_answer"})
    private Integer correctAns;

    private String difficulty;

    @JsonProperty("trackSlug")
    @JsonAlias({"track", "track_slug"})
    private String trackSlug;

    @JsonProperty("previousSkillId")
    @JsonAlias({"skillId", "previous_skill_id", "skill_id"})
    private UUID previousSkillId;

    @JsonProperty("previousQuestionId")
    @JsonAlias({"questionId", "previous_question_id", "question_id"})
    private UUID previousQuestionId;

    @JsonProperty("questionIndex")
    @JsonAlias({"question_index", "currentIndex", "current_index", "questionNumber", "question_number"})
    private Integer questionIndex;

    @JsonProperty("userId")
    @JsonAlias({"user_id"})
    private UUID userId;
}
