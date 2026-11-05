package com.aiupskillingplatform.services.assessment;

import com.aiupskillingplatform.dto.assessment.AssessmentQuestionRequestDTO;
import com.aiupskillingplatform.dto.assessment.AssessmentQuestionResponseDTO;
import com.aiupskillingplatform.dto.assessment.AssessmentSkillDTO;
import com.aiupskillingplatform.dto.assessment.QuestionDTO;
import com.aiupskillingplatform.entities.Question;
import com.aiupskillingplatform.entities.Skill;
import com.aiupskillingplatform.entities.User;
import com.aiupskillingplatform.entities.UserSkillMastery;
import com.aiupskillingplatform.enums.UserStatus;
import com.aiupskillingplatform.repositories.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssessmentService {

    // 12 assessment skills: 6 graph roots + 6 follow-up nodes
    private static final Map<String, List<String>> TRACK_ASSESSMENT_SKILLS = Map.of(
            "backend-development", List.of(
                    "variables-data-types",
                    "classes-objects",
                    "list-set-map",
                    "relational-database-concepts",
                    "how-internet-works",
                    "spring-framework-ioc",
                    "operators-expressions",
                    "encapsulation",
                    "hashmap-internals",
                    "sql-fundamentals",
                    "client-server-architecture",
                    "dependency-injection-spring-beans"
            )
    );

    private final QuestionRepository questionRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final UserSkillMasteryRepository userSkillMasteryRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public AssessmentQuestionResponseDTO getNextQuestion(AssessmentQuestionRequestDTO request, Authentication authentication) {
        return getNextQuestion(null, request, authentication);
    }

    // Fetches the next assessment question and updates skill status on correct answers
    @Transactional
    public AssessmentQuestionResponseDTO getNextQuestion(String trackSlug, AssessmentQuestionRequestDTO request, Authentication authentication) {
        if (request == null) {
            request = new AssessmentQuestionRequestDTO();
        }

        String targetSlug = (trackSlug != null && !trackSlug.isBlank()) ? trackSlug : request.getTrackSlug();
        if (targetSlug == null || targetSlug.isBlank()) {
            targetSlug = "backend-development";
        }

        List<String> skillSlugs = TRACK_ASSESSMENT_SKILLS.getOrDefault(targetSlug, TRACK_ASSESSMENT_SKILLS.get("backend-development"));
        int totalQuestions = skillSlugs.size();

        Integer correctAns = request.getCorrectAns();
        if (correctAns == null) {
            correctAns = 0;
        }

        User user = resolveUser(request.getUserId(), authentication);

        if (correctAns == 1) {
            Skill answeredSkill = resolveAnsweredSkill(request, skillSlugs);
            if (answeredSkill != null && user != null) {
                unlockSkillForUser(user, answeredSkill);
            }
        }

        int nextIndex = determineNextIndex(correctAns, request, skillSlugs);

        if (nextIndex >= totalQuestions) {
            return AssessmentQuestionResponseDTO.builder()
                    .questionIndex(totalQuestions)
                    .questionNumber(totalQuestions)
                    .totalQuestions(totalQuestions)
                    .isCompleted(true)
                    .skill(null)
                    .question(null)
                    .message("Assessment completed successfully. All initial skill graph nodes have been evaluated.")
                    .build();
        }

        String nextSkillSlug = skillSlugs.get(nextIndex);
        Skill nextSkill = skillRepository.findBySlugAndActiveTrue(nextSkillSlug)
                .orElseThrow(() -> new EntityNotFoundException("Skill not found for slug: " + nextSkillSlug));

        String difficulty = normalizeDifficulty(request.getDifficulty());
        Question question = fetchQuestionForSkill(nextSkill, difficulty);

        Object parsedOptions = (question != null) ? parseOptionData(question.getOptionData()) : Collections.emptyMap();
        String userSkillStatus = (user != null) ? getSkillStatusForUser(user.getId(), nextSkill.getId()) : "UNLOCKED";

        AssessmentSkillDTO skillDTO = new AssessmentSkillDTO(
                nextSkill.getId(),
                nextSkill.getName(),
                nextSkill.getSlug(),
                nextSkill.getCategory() != null ? nextSkill.getCategory().getName() : null,
                nextSkill.getCategory() != null ? nextSkill.getCategory().getId() : null,
                userSkillStatus
        );

        QuestionDTO questionDTO = (question != null) ? new QuestionDTO(
                question.getId(),
                question.getQuestionText(),
                question.getQuestionType(),
                parsedOptions,
                question.getDifficulty(),
                question.getCorrectAnswer(),
                question.getExplanation()
        ) : null;

        return AssessmentQuestionResponseDTO.builder()
                .questionIndex(nextIndex)
                .questionNumber(nextIndex + 1)
                .totalQuestions(totalQuestions)
                .isCompleted(false)
                .skill(skillDTO)
                .question(questionDTO)
                .message(String.format("Question %d of %d fetched successfully", nextIndex + 1, totalQuestions))
                .build();
    }

    // Returns ordered assessment skill slugs for a track
    public List<String> getAssessmentSkillSlugs(String trackSlug) {
        String slug = (trackSlug != null && !trackSlug.isBlank()) ? trackSlug : "backend-development";
        return TRACK_ASSESSMENT_SKILLS.getOrDefault(slug, TRACK_ASSESSMENT_SKILLS.get("backend-development"));
    }

    // Identifies which skill was answered from request metadata
    private Skill resolveAnsweredSkill(AssessmentQuestionRequestDTO request, List<String> skillSlugs) {
        if (request.getPreviousSkillId() != null) {
            return skillRepository.findById(request.getPreviousSkillId()).orElse(null);
        }
        if (request.getPreviousQuestionId() != null) {
            List<Skill> skills = questionRepository.findSkillsByQuestionId(request.getPreviousQuestionId());
            if (!skills.isEmpty()) {
                return skills.get(0);
            }
        }
        if (request.getQuestionIndex() != null && request.getQuestionIndex() >= 0 && request.getQuestionIndex() < skillSlugs.size()) {
            String slug = skillSlugs.get(request.getQuestionIndex());
            return skillRepository.findBySlugAndActiveTrue(slug).orElse(null);
        }
        return null;
    }

    // Sets skill status to UNLOCKED without altering mastery scores
    private void unlockSkillForUser(User user, Skill skill) {
        UserSkillMastery mastery = userSkillMasteryRepository
                .findByUserIdAndSkillId(user.getId(), skill.getId())
                .orElseGet(() -> {
                    UserSkillMastery newMastery = new UserSkillMastery();
                    newMastery.setUser(user);
                    newMastery.setSkill(skill);
                    newMastery.setMasteryScore(0.0);
                    newMastery.setConfidenceScore(0.0);
                    newMastery.setEvidenceCount(0);
                    newMastery.setCreatedAt(Instant.now());
                    return newMastery;
                });

        mastery.setStatus("UNLOCKED");
        mastery.setUpdatedAt(Instant.now());
        userSkillMasteryRepository.save(mastery);
        log.info("Skill {} ({}) status set to UNLOCKED for user {}", skill.getName(), skill.getId(), user.getEmail());
    }

    // Advances to next question index in sequence
    private int determineNextIndex(Integer correctAns, AssessmentQuestionRequestDTO request, List<String> skillSlugs) {
        if (correctAns == 0) {
            return 0;
        }

        if (request.getQuestionIndex() != null && request.getQuestionIndex() >= 0) {
            return request.getQuestionIndex() + 1;
        }

        if (request.getPreviousSkillId() != null) {
            Optional<Skill> prevSkill = skillRepository.findById(request.getPreviousSkillId());
            if (prevSkill.isPresent()) {
                int idx = skillSlugs.indexOf(prevSkill.get().getSlug());
                if (idx >= 0) {
                    return idx + 1;
                }
            }
        }

        return 1;
    }

    // Checks user's current status for a skill in the graph
    private String getSkillStatusForUser(UUID userId, UUID skillId) {
        return userSkillMasteryRepository.findByUserIdAndSkillId(userId, skillId)
                .map(m -> m.getStatus() != null ? m.getStatus() : "LOCKED")
                .orElse("UNLOCKED");
    }

    // Normalizes input to BEGINNER, MEDIUM, or HARD
    private String normalizeDifficulty(String difficulty) {
        if (difficulty == null || difficulty.isBlank()) {
            return "BEGINNER";
        }
        String upper = difficulty.trim().toUpperCase();
        return switch (upper) {
            case "BEGINNER", "EASY", "LOW" -> "BEGINNER";
            case "MEDIUM", "INTERMEDIATE", "MID" -> "MEDIUM";
            case "HARD", "ADVANCED", "DIFFICULT" -> "HARD";
            default -> upper;
        };
    }

    // Finds matching question by difficulty with fallback
    private Question fetchQuestionForSkill(Skill skill, String difficulty) {
        List<Question> questions = questionRepository.findBySkillIdAndDifficulty(skill.getId(), difficulty);
        if (!questions.isEmpty()) {
            return questions.get(0);
        }
        questions = questionRepository.findBySkillId(skill.getId());
        if (!questions.isEmpty()) {
            return questions.get(0);
        }
        return null;
    }

    // Parses JSON option data into key-value map
    private Object parseOptionData(String optionData) {
        if (optionData == null || optionData.isBlank()) {
            return Collections.emptyMap();
        }
        try {
            return objectMapper.readValue(optionData, Object.class);
        } catch (Exception e) {
            return optionData;
        }
    }

    // Resolves user from request ID, authentication token, or fallback
    private User resolveUser(UUID requestUserId, Authentication authentication) {
        if (requestUserId != null) {
            return userRepository.findById(requestUserId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + requestUserId));
        }
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                return userOpt.get();
            }
        }
        return userRepository.findAll().stream()
                .filter(u -> u.getStatus() == UserStatus.ACTIVE)
                .findFirst()
                .orElse(null);
    }
}
