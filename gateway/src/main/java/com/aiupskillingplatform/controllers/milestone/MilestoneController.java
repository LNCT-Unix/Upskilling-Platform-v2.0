package com.aiupskillingplatform.controllers.milestone;

import com.aiupskillingplatform.dto.milestone.*;
import com.aiupskillingplatform.services.milestone.MilestoneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/milestones")
@RequiredArgsConstructor
public class MilestoneController {

    private final MilestoneService milestoneService;

    @PostMapping("/start")
    public ResponseEntity<StartMilestoneResponse> startMilestone(
            @Valid @RequestBody StartMilestoneRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(milestoneService.startMilestone(request, authentication));
    }

    @GetMapping("/{attemptId}")
    public ResponseEntity<GetMilestoneResponse> getMilestone(
            @PathVariable String attemptId,
            Authentication authentication) {
        return ResponseEntity.ok(milestoneService.getMilestone(attemptId, authentication));
    }

    @PatchMapping("/{attemptId}/answers/{questionId}")
    public ResponseEntity<SaveAnswerResponse> saveAnswer(
            @PathVariable String attemptId,
            @PathVariable String questionId,
            @Valid @RequestBody SaveAnswerRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(milestoneService.saveAnswer(attemptId, questionId, request, authentication));
    }

    @PostMapping("/{attemptId}/submit")
    public ResponseEntity<SubmitMilestoneResponse> submitMilestone(
            @PathVariable String attemptId,
            Authentication authentication) {
        return ResponseEntity.ok(milestoneService.submitMilestone(attemptId, authentication));
    }
}
