package com.aiupskillingplatform.controllers.IrtAssessment;

import com.aiupskillingplatform.dto.assessment.AnswerResultResponse;
import com.aiupskillingplatform.dto.assessment.AssessmentStepResponse;
import com.aiupskillingplatform.dto.assessment.SubmitAnswerRequest;
import com.aiupskillingplatform.services.assessment.AssessmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tracks/{trackSlug}/assessment")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;

    // Read-only: returns the first question.
    @GetMapping("/start")
    public ResponseEntity<AssessmentStepResponse> start(
            @PathVariable String trackSlug,
            @RequestParam(defaultValue = "BEGINNER") String difficulty,
            Authentication authentication) {
        return ResponseEntity.ok(assessmentService.start(trackSlug, difficulty, authentication));
    }

    // State-changing: grades the answer, unlocks the skill if correct, returns the next question.
    @PostMapping("/answers")
    public ResponseEntity<AnswerResultResponse> submitAnswer(
            @PathVariable String trackSlug,
            @Valid @RequestBody SubmitAnswerRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(assessmentService.submitAnswer(trackSlug, request, authentication));
    }
}
