package com.aiupskillingplatform.services.roadmap;

import com.aiupskillingplatform.dto.roadmap.personalized.*;
import com.aiupskillingplatform.entities.*;
import com.aiupskillingplatform.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoadmapIntegrationService {

    private final NodeRoadmapClient nodeRoadmapClient;
    private final AssessmentAttemptRepository attemptRepository;
    private final AssessmentResponseRepository responseRepository;
    private final TrackRepository trackRepository;
    private final SkillRepository skillRepository;
    private final SkillDependencyRepository dependencyRepository;
    private final UserSkillMasteryRepository masteryRepository;
    private final QuestionRepository questionRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<String> generateRoadmap(User user, UserGenerateRoadmapRequestDTO request) {
        log.info("Generating personalized roadmap for user={}", user.getId());

        // 1. Resolve Track
        Track track = resolveTrack(request);

        // 2. Resolve Assessment Attempt and Graded Questions
        AssessmentAttempt attempt = attemptRepository
                .findTopByUserIdAndTrackSlugAndStatusOrderByStartedAtDesc(user.getId(), track.getSlug(), "COMPLETED")
                .or(() -> attemptRepository.findTopByUserIdAndTrackIdOrderByStartedAtDesc(user.getId(), track.getId()))
                .or(() -> attemptRepository.findTopByUserIdOrderByStartedAtDesc(user.getId()))
                .orElse(null);

        AssessmentSummaryDTO assessmentSummary;
        List<QuestionItemDTO> questions = new ArrayList<>();

        if (attempt != null) {
            // NOTE: difficulty, correct_count, wrong_count, score columns are not yet in the DB schema.
            // Your teammate must add them via a Flyway migration. Until then, safe defaults are used.
            assessmentSummary = AssessmentSummaryDTO.builder()
                    .assessmentId(attempt.getId().toString())
                    .trackSlug(track.getSlug())
                    .difficulty("BEGINNER")          // default until DB column is migrated
                    .totalQuestions(attempt.getTotalQuestions() != null ? attempt.getTotalQuestions() : 0)
                    .correctCount(0)                  // default until DB column is migrated
                    .wrongCount(0)                    // default until DB column is migrated
                    .score(0.0)                       // default until DB column is migrated
                    .build();

            List<AssessmentResponse> responses = responseRepository.findByAttemptIdOrderByQuestionOrderAsc(attempt.getId());
            for (AssessmentResponse r : responses) {
                Question q = r.getQuestion();
                List<Skill> qSkills = questionRepository.findSkillsByQuestionId(q.getId());
                Skill skill = qSkills.isEmpty() ? null : qSkills.get(0);

                questions.add(QuestionItemDTO.builder()
                        .questionId(q.getId().toString())
                        .skillSlug(skill != null ? skill.getSlug() : "general")
                        .skillName(skill != null ? skill.getName() : "General Concept")
                        .difficulty(q.getDifficulty() != null ? q.getDifficulty() : "BEGINNER")
                        .questionText(q.getQuestionText())
                        .isCorrect(Boolean.TRUE.equals(r.getIsCorrect()))
                        .build());
            }
        } else {
            assessmentSummary = AssessmentSummaryDTO.builder()
                    .assessmentId(UUID.randomUUID().toString())
                    .trackSlug(track.getSlug())
                    .difficulty("BEGINNER")
                    .totalQuestions(0)
                    .correctCount(0)
                    .wrongCount(0)
                    .score(0.0)
                    .build();
        }

        // 3. Fetch Skills and User Mastery for the Track
        List<Skill> trackSkills = skillRepository.findByTrackIdAndActiveTrue(track.getId());
        if (trackSkills.isEmpty()) {
            trackSkills = skillRepository.findByActiveTrueOrderBySortOrderAsc();
        }

        Map<UUID, UserSkillMastery> masteryMap = masteryRepository.findByUserId(user.getId()).stream()
                .filter(m -> m.getSkill() != null)
                .collect(Collectors.toMap(m -> m.getSkill().getId(), m -> m, (a, b) -> a));

        List<SkillItemDTO> skillDTOs = trackSkills.stream()
                .map(skill -> {
                    UserSkillMastery m = masteryMap.get(skill.getId());
                    String status = (m != null && m.getStatus() != null) ? m.getStatus() : "LOCKED";
                    Double score = (m != null && m.getMasteryScore() != null) ? m.getMasteryScore() : 0.0;
                    return SkillItemDTO.builder()
                            .skillSlug(skill.getSlug())
                            .name(skill.getName())
                            .status(status)
                            .score(score)
                            .build();
                })
                .collect(Collectors.toList());

        // 4. Fetch Dependencies
        List<SkillDependency> dependencies = dependencyRepository.findByTrackId(track.getId());
        if (dependencies.isEmpty()) {
            dependencies = dependencyRepository.findAll();
        }

        List<DependencyItemDTO> dependencyDTOs = dependencies.stream()
                .filter(d -> d.getPrerequisiteSkill() != null && d.getDependentSkill() != null)
                .map(d -> DependencyItemDTO.builder()
                        .prerequisite(d.getPrerequisiteSkill().getSlug())
                        .dependent(d.getDependentSkill().getSlug())
                        .build())
                .collect(Collectors.toList());

        // 5. Construct Payload
        String targetRole = (request != null && request.getTargetRole() != null && !request.getTargetRole().isBlank())
                ? request.getTargetRole().trim()
                : track.getName();

        Integer studyHours = (request != null && request.getStudyHoursPerWeek() != null && request.getStudyHoursPerWeek() >= 1)
                ? request.getStudyHoursPerWeek()
                : 10;

        String requestId = (request != null && request.getRequestId() != null && !request.getRequestId().isBlank())
                ? request.getRequestId().trim()
                : null;

        GenerateRoadmapPayloadDTO payload = GenerateRoadmapPayloadDTO.builder()
                .requestId(requestId)
                .userId(user.getId().toString())
                .trackId(track.getId().toString())
                .assessmentRef(attempt != null ? attempt.getId().toString() : null)
                .targetRole(targetRole)
                .studyHoursPerWeek(studyHours)
                .assessment(assessmentSummary)
                .questions(questions)
                .skills(skillDTOs)
                .dependencies(dependencyDTOs)
                .build();

        // 6. Forward to Node.js Microservice
        return nodeRoadmapClient.generateRoadmap(payload);
    }

    public ResponseEntity<String> getActiveRoadmap(UUID userId, String trackId) {
        return nodeRoadmapClient.getActiveRoadmap(userId.toString(), trackId);
    }

    public ResponseEntity<String> getRoadmapHistory(UUID userId, String trackId) {
        return nodeRoadmapClient.getRoadmapHistory(userId.toString(), trackId);
    }

    public ResponseEntity<String> updateProgress(String roadmapId, UUID userId, UpdateRoadmapProgressRequestDTO request) {
        return nodeRoadmapClient.updateProgress(roadmapId, userId.toString(), request);
    }

    private Track resolveTrack(UserGenerateRoadmapRequestDTO request) {
        if (request != null && request.getTrackId() != null && !request.getTrackId().isBlank()) {
            try {
                UUID trackUuid = UUID.fromString(request.getTrackId().trim());
                Optional<Track> trackOpt = trackRepository.findById(trackUuid);
                if (trackOpt.isPresent()) return trackOpt.get();
            } catch (IllegalArgumentException ignored) {}
        }

        if (request != null && request.getTrackSlug() != null && !request.getTrackSlug().isBlank()) {
            Optional<Track> trackOpt = trackRepository.findBySlug(request.getTrackSlug().trim());
            if (trackOpt.isPresent()) return trackOpt.get();
        }

        return trackRepository.findBySlug("backend-development")
                .orElseGet(() -> trackRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No tracks available in the database")));
    }
}
