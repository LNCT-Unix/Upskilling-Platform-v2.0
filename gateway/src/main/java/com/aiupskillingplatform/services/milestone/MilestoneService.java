package com.aiupskillingplatform.services.milestone;

import com.aiupskillingplatform.dto.milestone.*;
import com.aiupskillingplatform.entities.*;
import com.aiupskillingplatform.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MilestoneService {

    public static final int QUESTIONS_PER_ATTEMPT = 8;
    public static final int PASS_SCORE_THRESHOLD = 6; // 6 / 8 = 75%
    public static final String STATUS_IN_PROGRESS = "IN_PROGRESS";
    public static final String STATUS_COMPLETED = "COMPLETED";
    public static final String STATUS_ABANDONED = "ABANDONED";

    private final MilestoneQuestionRepository questionRepository;
    private final MilestoneAttemptRepository attemptRepository;
    private final MilestoneAttemptQuestionRepository attemptQuestionRepository;
    private final SkillRepository skillRepository;
    private final SkillRoadmapRepository skillRoadmapRepository;
    private final RoadmapNodeRepository roadmapNodeRepository;
    private final UserSkillMasteryRepository masteryRepository;
    private final UserRepository userRepository;

    /**
     * API 1: Start Milestone Test for 1 whole Skill
     */
    @Transactional
    public StartMilestoneResponse startMilestone(StartMilestoneRequest request, Authentication authentication) {
        User user = currentUser(authentication);
        Skill skill = resolveSkill(request);

        // Check if user already has an IN_PROGRESS attempt for this entire skill (resuming support)
        Optional<MilestoneAttempt> inProgressOpt = attemptRepository.findByUserIdAndSkillIdAndStatus(
                user.getId(), skill.getId(), STATUS_IN_PROGRESS);

        if (inProgressOpt.isPresent()) {
            MilestoneAttempt existing = inProgressOpt.get();
            log.info("Resuming existing IN_PROGRESS attempt {} for user {} on skill {} ({})",
                    existing.getId(), user.getId(), skill.getName(), skill.getId());
            return StartMilestoneResponse.builder()
                    .attemptId(existing.getId().toString())
                    .skillId(skill.getId().toString())
                    .skillSlug(skill.getSlug())
                    .skillName(skill.getName())
                    .nodeId(existing.getNode() != null ? existing.getNode().getId().toString() : null)
                    .attemptNumber(existing.getAttemptNumber())
                    .totalQuestions(QUESTIONS_PER_ATTEMPT)
                    .status(existing.getStatus())
                    .build();
        }

        // Determine next attempt number (1, 2, 3...)
        int nextAttemptNumber = attemptRepository.findMaxAttemptNumberByUserIdAndSkillId(user.getId(), skill.getId())
                .orElse(0) + 1;

        // Fetch active questions belonging to the requested skill
        List<MilestoneQuestion> activeQuestions = questionRepository.findBySkillIdAndIsActiveTrue(skill.getId());

        // Fallback: If questions are stored with node_id pointing to roadmap nodes of this skill
        if (activeQuestions.isEmpty()) {
            Optional<SkillRoadmap> roadmapOpt = skillRoadmapRepository.findBySkillIdAndActiveTrue(skill.getId());
            if (roadmapOpt.isPresent() && !roadmapOpt.get().getNodes().isEmpty()) {
                List<UUID> nodeIds = roadmapOpt.get().getNodes().stream()
                        .map(RoadmapNode::getId)
                        .collect(Collectors.toList());
                activeQuestions = questionRepository.findByNodeIdInAndIsActiveTrue(nodeIds);
            }
        }

        if (activeQuestions.size() < QUESTIONS_PER_ATTEMPT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Insufficient active questions available for milestone test for skill: " + skill.getName()
                            + ". Required: " + QUESTIONS_PER_ATTEMPT + ", Available: " + activeQuestions.size());
        }

        // Exclude questions already used by the same user for this skill
        List<UUID> usedQuestionIds = attemptQuestionRepository.findUsedQuestionIdsByUserAndSkill(user.getId(), skill.getId());
        List<MilestoneQuestion> unusedQuestions = activeQuestions.stream()
                .filter(q -> !usedQuestionIds.contains(q.getId()))
                .collect(Collectors.toList());

        List<MilestoneQuestion> selectedQuestions;
        if (unusedQuestions.size() >= QUESTIONS_PER_ATTEMPT) {
            Collections.shuffle(unusedQuestions);
            selectedQuestions = new ArrayList<>(unusedQuestions.subList(0, QUESTIONS_PER_ATTEMPT));
        } else {
            // Graceful fallback: top up from remaining active questions
            Set<UUID> unusedIds = unusedQuestions.stream().map(MilestoneQuestion::getId).collect(Collectors.toSet());
            List<MilestoneQuestion> pool = new ArrayList<>(unusedQuestions);

            List<MilestoneQuestion> repeatPool = activeQuestions.stream()
                    .filter(q -> !unusedIds.contains(q.getId()))
                    .collect(Collectors.toList());
            Collections.shuffle(repeatPool);

            for (MilestoneQuestion q : repeatPool) {
                if (pool.size() < QUESTIONS_PER_ATTEMPT) {
                    pool.add(q);
                } else {
                    break;
                }
            }
            Collections.shuffle(pool);
            selectedQuestions = pool;
        }

        // Create milestone_attempts record for the skill
        MilestoneAttempt attempt = new MilestoneAttempt();
        attempt.setUser(user);
        attempt.setSkill(skill);
        attempt.setNode(null);
        attempt.setAttemptNumber(nextAttemptNumber);
        attempt.setStatus(STATUS_IN_PROGRESS);
        attempt.setScore(null);
        attempt.setStartedAt(Instant.now());
        MilestoneAttempt savedAttempt = attemptRepository.save(attempt);

        // Create 8 milestone_attempt_questions records
        List<MilestoneAttemptQuestion> attemptQuestions = new ArrayList<>(QUESTIONS_PER_ATTEMPT);
        for (int i = 0; i < QUESTIONS_PER_ATTEMPT; i++) {
            MilestoneQuestion q = selectedQuestions.get(i);
            MilestoneAttemptQuestion maq = new MilestoneAttemptQuestion();
            maq.setAttempt(savedAttempt);
            maq.setQuestion(q);
            maq.setQuestionOrder(i + 1);
            maq.setSelectedAnswer(null);
            maq.setIsCorrect(null);
            attemptQuestions.add(maq);
        }
        attemptQuestionRepository.saveAll(attemptQuestions);

        log.info("Created new milestone attempt {} (attempt #{}) for user {} on skill {} ({})",
                savedAttempt.getId(), nextAttemptNumber, user.getId(), skill.getName(), skill.getId());

        return StartMilestoneResponse.builder()
                .attemptId(savedAttempt.getId().toString())
                .skillId(skill.getId().toString())
                .skillSlug(skill.getSlug())
                .skillName(skill.getName())
                .nodeId(null)
                .attemptNumber(savedAttempt.getAttemptNumber())
                .totalQuestions(QUESTIONS_PER_ATTEMPT)
                .status(savedAttempt.getStatus())
                .build();
    }

    /**
     * API 2: Get Milestone Questions & Current Answers
     */
    @Transactional(readOnly = true)
    public GetMilestoneResponse getMilestone(String attemptIdStr, Authentication authentication) {
        User user = currentUser(authentication);
        UUID attemptId = parseUuid(attemptIdStr, "attemptId");

        MilestoneAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Milestone attempt not found: " + attemptIdStr));

        validateOwnership(attempt, user);

        List<MilestoneAttemptQuestion> attemptQuestions = attemptQuestionRepository
                .findByAttemptIdOrderByQuestionOrderAsc(attempt.getId());

        List<MilestoneQuestionDTO> questionDTOs = attemptQuestions.stream().map(maq -> {
            MilestoneQuestion q = maq.getQuestion();
            return MilestoneQuestionDTO.builder()
                    .questionId(q.getId().toString())
                    .questionOrder(maq.getQuestionOrder())
                    .questionText(q.getQuestionText())
                    .options(q.getOptions() != null ? q.getOptions() : Collections.emptyMap())
                    .selectedAnswer(maq.getSelectedAnswer())
                    .build();
        }).collect(Collectors.toList());

        return GetMilestoneResponse.builder()
                .attemptId(attempt.getId().toString())
                .status(attempt.getStatus())
                .totalQuestions(questionDTOs.size())
                .questions(questionDTOs)
                .build();
    }

    /**
     * API 3: Save Individual Answer
     */
    @Transactional
    public SaveAnswerResponse saveAnswer(String attemptIdStr, String questionIdStr, SaveAnswerRequest request, Authentication authentication) {
        User user = currentUser(authentication);
        UUID attemptId = parseUuid(attemptIdStr, "attemptId");
        UUID questionId = parseUuid(questionIdStr, "questionId");

        MilestoneAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Milestone attempt not found: " + attemptIdStr));

        validateOwnership(attempt, user);

        if (!STATUS_IN_PROGRESS.equalsIgnoreCase(attempt.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot save answer. Attempt is already " + attempt.getStatus());
        }

        MilestoneAttemptQuestion maq = attemptQuestionRepository.findByAttemptIdAndQuestionId(attemptId, questionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Question " + questionIdStr + " is not assigned to attempt " + attemptIdStr));

        String answer = normalizeAnswer(request.getSelectedAnswer());
        maq.setSelectedAnswer(answer);
        attemptQuestionRepository.save(maq);

        return SaveAnswerResponse.builder()
                .attemptId(attempt.getId().toString())
                .questionId(maq.getQuestion().getId().toString())
                .selectedAnswer(answer)
                .saved(true)
                .build();
    }

    /**
     * API 4: Submit Milestone Attempt
     */
    @Transactional
    public SubmitMilestoneResponse submitMilestone(String attemptIdStr, Authentication authentication) {
        User user = currentUser(authentication);
        UUID attemptId = parseUuid(attemptIdStr, "attemptId");

        MilestoneAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Milestone attempt not found: " + attemptIdStr));

        validateOwnership(attempt, user);

        if (STATUS_COMPLETED.equalsIgnoreCase(attempt.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attempt has already been submitted and completed.");
        }
        if (STATUS_ABANDONED.equalsIgnoreCase(attempt.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot submit an abandoned attempt.");
        }

        List<MilestoneAttemptQuestion> attemptQuestions = attemptQuestionRepository
                .findByAttemptIdOrderByQuestionOrderAsc(attempt.getId());

        int correctCount = 0;
        for (MilestoneAttemptQuestion maq : attemptQuestions) {
            MilestoneQuestion q = maq.getQuestion();
            boolean correct = q.getCorrectAnswer() != null
                    && maq.getSelectedAnswer() != null
                    && q.getCorrectAnswer().trim().equalsIgnoreCase(maq.getSelectedAnswer().trim());
            maq.setIsCorrect(correct);
            if (correct) {
                correctCount++;
            }
        }
        attemptQuestionRepository.saveAll(attemptQuestions);

        int total = attemptQuestions.size();
        int incorrectCount = total - correctCount;
        int score = correctCount;
        boolean passed = score >= PASS_SCORE_THRESHOLD;

        attempt.setStatus(STATUS_COMPLETED);
        attempt.setScore(score);
        attempt.setCompletedAt(Instant.now());
        attemptRepository.save(attempt);

        if (passed) {
            updateSkillMasteryOnPass(user, attempt.getSkill(), score, total);
        }

        log.info("User {} submitted milestone attempt {} for skill {}. Score: {}/{}, Passed: {}",
                user.getId(), attempt.getId(), attempt.getSkill().getName(), score, total, passed);

        return SubmitMilestoneResponse.builder()
                .attemptId(attempt.getId().toString())
                .status(STATUS_COMPLETED)
                .totalQuestions(total)
                .correctAnswers(correctCount)
                .incorrectAnswers(incorrectCount)
                .score(score)
                .passed(passed)
                .build();
    }

    private void updateSkillMasteryOnPass(User user, Skill skill, int score, int totalQuestions) {
        try {
            UserSkillMastery mastery = masteryRepository.findByUserIdAndSkillId(user.getId(), skill.getId())
                    .orElseGet(() -> {
                        UserSkillMastery m = new UserSkillMastery();
                        m.setUser(user);
                        m.setSkill(skill);
                        m.setCreatedAt(Instant.now());
                        return m;
                    });
            mastery.setStatus("UNLOCKED");
            double calculatedScore = ((double) score / totalQuestions) * 100.0;
            if (calculatedScore > (mastery.getMasteryScore() != null ? mastery.getMasteryScore() : 0.0)) {
                mastery.setMasteryScore(calculatedScore);
            }
            mastery.setEvidenceCount((mastery.getEvidenceCount() != null ? mastery.getEvidenceCount() : 0) + 1);
            mastery.setUpdatedAt(Instant.now());
            masteryRepository.save(mastery);
        } catch (Exception e) {
            log.warn("Could not update user_skill_mastery for user {} and skill {}: {}",
                    user.getId(), skill.getId(), e.getMessage());
        }
    }

    private User currentUser(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User must be authenticated");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private Skill resolveSkill(StartMilestoneRequest request) {
        String identifier = null;
        if (request.getSkillId() != null && !request.getSkillId().isBlank()) {
            identifier = request.getSkillId().trim();
        } else if (request.getSkillSlug() != null && !request.getSkillSlug().isBlank()) {
            identifier = request.getSkillSlug().trim();
        } else if (request.getNodeId() != null && !request.getNodeId().isBlank()) {
            RoadmapNode node = resolveNode(request.getNodeId());
            if (node.getRoadmap() != null && node.getRoadmap().getSkill() != null) {
                return node.getRoadmap().getSkill();
            }
        }

        if (identifier == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "skillId or skillSlug is required");
        }

        try {
            UUID uuid = UUID.fromString(identifier);
            return skillRepository.findById(uuid)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found with id: " + identifier));
        } catch (IllegalArgumentException e) {
            return skillRepository.findBySlug(identifier)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found with slug: " + identifier));
        }
    }

    private RoadmapNode resolveNode(String nodeId) {
        if (nodeId == null || nodeId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "nodeId is required");
        }
        try {
            UUID uuid = UUID.fromString(nodeId.trim());
            return roadmapNodeRepository.findById(uuid)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Roadmap node not found with id: " + nodeId));
        } catch (IllegalArgumentException e) {
            return roadmapNodeRepository.findBySlug(nodeId.trim())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Roadmap node not found with slug: " + nodeId));
        }
    }

    private void validateOwnership(MilestoneAttempt attempt, User user) {
        if (!attempt.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to milestone attempt");
        }
    }

    private UUID parseUuid(String idStr, String paramName) {
        if (idStr == null || idStr.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, paramName + " is required");
        }
        try {
            return UUID.fromString(idStr.trim());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid UUID format for " + paramName + ": " + idStr);
        }
    }

    private String normalizeAnswer(String answer) {
        if (answer == null || answer.isBlank()) {
            return null;
        }
        String trimmed = answer.trim().toUpperCase();
        if (!trimmed.matches("^[A-D]$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "selectedAnswer must be 'A', 'B', 'C', or 'D'");
        }
        return trimmed;
    }
}
