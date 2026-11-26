package com.aiupskillingplatform.dto.milestone;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaveAnswerRequest {

    @Pattern(regexp = "^[A-Da-d]$", message = "selectedAnswer must be 'A', 'B', 'C', or 'D'")
    private String selectedAnswer;
}
