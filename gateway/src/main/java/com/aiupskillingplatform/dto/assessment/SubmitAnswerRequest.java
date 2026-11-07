package com.aiupskillingplatform.dto.assessment;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record SubmitAnswerRequest(
        @NotNull
        @JsonProperty("questionId")
        @JsonAlias({"question_id", "questionId"})
        UUID questionId,

        @NotBlank
        @JsonProperty("selectedAnswer")
        @JsonAlias({"selected_answer", "selectedAnswer", "answer"})
        String selectedAnswer,

        @JsonProperty("difficulty")
        String difficulty
) {}
