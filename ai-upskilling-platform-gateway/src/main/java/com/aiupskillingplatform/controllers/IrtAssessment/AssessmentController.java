package com.aiupskillingplatform.controllers.IrtAssessment;

import com.aiupskillingplatform.dto.assessment.AssessmentQuestionRequestDTO;
import com.aiupskillingplatform.dto.assessment.AssessmentQuestionResponseDTO;
import com.aiupskillingplatform.services.assessment.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/track")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;

    @PostMapping(value = {"/{trackSlug}/assesment/getquestion", "/assesment/getquestion"})
    public ResponseEntity<AssessmentQuestionResponseDTO> getNextQuestion(
            @PathVariable(required = false) String trackSlug,
            @RequestBody(required = false) AssessmentQuestionRequestDTO request,
            Authentication authentication) {

        if (request == null) {
            request = new AssessmentQuestionRequestDTO();
        }

        AssessmentQuestionResponseDTO response = assessmentService.getNextQuestion(trackSlug, request, authentication);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = {"/{trackSlug}/assesment/getquestion", "/assesment/getquestion"})
    public ResponseEntity<AssessmentQuestionResponseDTO> getNextQuestionViaGet(
            @PathVariable(required = false) String trackSlug,
            @RequestParam(value = "correct_ans", required = false, defaultValue = "0") Integer correctAns,
            @RequestParam(value = "difficulty", required = false, defaultValue = "BEGINNER") String difficulty,
            @RequestParam(value = "previousSkillId", required = false) UUID previousSkillId,
            @RequestParam(value = "previousQuestionId", required = false) UUID previousQuestionId,
            @RequestParam(value = "questionIndex", required = false) Integer questionIndex,
            @RequestParam(value = "userId", required = false) UUID userId,
            Authentication authentication) {

        AssessmentQuestionRequestDTO request = AssessmentQuestionRequestDTO.builder()
                .correctAns(correctAns)
                .difficulty(difficulty)
                .trackSlug(trackSlug)
                .previousSkillId(previousSkillId)
                .previousQuestionId(previousQuestionId)
                .questionIndex(questionIndex)
                .userId(userId)
                .build();

        AssessmentQuestionResponseDTO response = assessmentService.getNextQuestion(trackSlug, request, authentication);
        return ResponseEntity.ok(response);
    }
}
