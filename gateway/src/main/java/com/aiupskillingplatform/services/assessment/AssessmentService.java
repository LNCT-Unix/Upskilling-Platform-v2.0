package com.aiupskillingplatform.services.assessment;

import com.aiupskillingplatform.dto.assessment.AnswerResultResponse;
import com.aiupskillingplatform.dto.assessment.AssessmentQuestionDTO;
import com.aiupskillingplatform.dto.assessment.AssessmentSkillDTO;
import com.aiupskillingplatform.dto.assessment.AssessmentStepResponse;
import com.aiupskillingplatform.dto.assessment.SubmitAnswerRequest;
import com.aiupskillingplatform.entities.Question;
import com.aiupskillingplatform.entities.Skill;
import com.aiupskillingplatform.entities.User;
import com.aiupskillingplatform.entities.UserSkillMastery;
import com.aiupskillingplatform.repositories.QuestionRepository;
import com.aiupskillingplatform.repositories.SkillRepository;
import com.aiupskillingplatform.repositories.UserRepository;
import com.aiupskillingplatform.repositories.UserSkillMasteryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.concurrent.ThreadLocalRandom;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssessmentService {

    private static final Map<String, List<String>> TRACK_ASSESSMENT_SKILLS = Map.of(
            "backend-development", List.of(
                    "variables-data-types", "classes-objects", "list-set-map",
                    "relational-database-concepts", "how-internet-works", "spring-framework-ioc",
                    "operators-expressions", "encapsulation", "hashmap-internals",
                    "sql-fundamentals", "client-server-architecture", "dependency-injection-spring-beans"));

    private static final String LOCKED = "LOCKED";
    private static final String UNLOCKED = "UNLOCKED";

    private final QuestionRepository questionRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final UserSkillMasteryRepository masteryRepository;
    private final ObjectMapper objectMapper;

    // Starts assessment and returns initial question
    @Transactional(readOnly = true)
    public AssessmentStepResponse start(String trackSlug, String difficulty, Authentication auth) {
        List<String> slugs = skillsForTrack(trackSlug);
        User user = currentUser(auth);
        return buildStep(slugs, 0, normalizeDifficulty(difficulty), user);
    }

    // Grades submitted answer and advances to next question
    @Transactional
    public AnswerResultResponse submitAnswer(String trackSlug, SubmitAnswerRequest req, Authentication auth) {
        List<String> slugs = skillsForTrack(trackSlug);
        User user = currentUser(auth);

        Question question = questionRepository.findById(req.questionId())
                .orElseThrow(() -> notFound("Question not found"));

        Skill skill = questionRepository.findSkillsByQuestionId(question.getId()).stream()
                .findFirst()
                .orElseThrow(() -> notFound("Question is not linked to a skill"));

        int answeredIndex = slugs.indexOf(skill.getSlug());
        if (answeredIndex < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Question does not belong to this assessment");
        }

        boolean correct = isCorrect(question, req.selectedAnswer());
        if (correct) {
            unlockIfLocked(user, skill);
        }

        AssessmentStepResponse next =
                buildStep(slugs, answeredIndex + 1, normalizeDifficulty(req.difficulty()), user);

        return new AnswerResultResponse(correct, question.getCorrectAnswer(), question.getExplanation(), next);
    }

    // Builds step response for a given index in sequence
    private AssessmentStepResponse buildStep(List<String> slugs, int index, String difficulty, User user) {
        int total = slugs.size();

        if (index >= total) {
            return new AssessmentStepResponse(total, total, total, true, null, null,
                    "Assessment completed successfully.");
        }

        Skill skill = skillRepository.findBySlugAndActiveTrue(slugs.get(index))
                .orElseThrow(() -> notFound("Skill not found: " + slugs.get(index)));

        Question question = pickQuestion(skill, difficulty)
                .orElseThrow(() -> notFound("No questions available for skill: " + skill.getSlug()));

        AssessmentSkillDTO skillDTO = new AssessmentSkillDTO(
                skill.getId(), skill.getName(), skill.getSlug(),
                skill.getCategory() != null ? skill.getCategory().getName() : null,
                skill.getCategory() != null ? skill.getCategory().getId() : null,
                statusFor(user, skill));

        AssessmentQuestionDTO questionDTO = new AssessmentQuestionDTO(
                question.getId(), question.getQuestionText(), question.getQuestionType(),
                parseOptions(question.getOptionData()), question.getDifficulty());

        return new AssessmentStepResponse(index, index + 1, total, false, skillDTO, questionDTO,
                "Question %d of %d".formatted(index + 1, total));
    }

    // Retrieves list of skill slugs for track
    private List<String> skillsForTrack(String trackSlug) {
        List<String> slugs = TRACK_ASSESSMENT_SKILLS.get(trackSlug);
        if (slugs == null) throw notFound("Unknown track: " + trackSlug);
        return slugs;
    }

    // Resolves authenticated user from security context
    private User currentUser(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    // Checks if selected answer matches correct answer
    private boolean isCorrect(Question q, String selected) {
        return q.getCorrectAnswer() != null
                && selected != null
                && q.getCorrectAnswer().trim().equalsIgnoreCase(selected.trim());
    }

    // Unlocks skill if currently locked or not started
    private void unlockIfLocked(User user, Skill skill) {
        UserSkillMastery mastery = masteryRepository.findByUserIdAndSkillId(user.getId(), skill.getId())
                .orElseGet(() -> {
                    UserSkillMastery m = new UserSkillMastery();
                    m.setUser(user);
                    m.setSkill(skill);
                    m.setMasteryScore(0.0);
                    m.setConfidenceScore(0.0);
                    m.setEvidenceCount(0);
                    m.setStatus(LOCKED);
                    m.setCreatedAt(Instant.now());
                    return m;
                });

        if (mastery.getStatus() == null || LOCKED.equals(mastery.getStatus())) {
            mastery.setStatus(UNLOCKED);
            mastery.setUpdatedAt(Instant.now());
            masteryRepository.save(mastery);
            log.info("Skill {} unlocked for user {}", skill.getSlug(), user.getId());
        }
    }

    // Returns user's status for a skill
    private String statusFor(User user, Skill skill) {
        return masteryRepository.findByUserIdAndSkillId(user.getId(), skill.getId())
                .map(m -> m.getStatus() != null ? m.getStatus() : LOCKED)
                .orElse(LOCKED);
    }

    // Picks a question matching difficulty with fallback to any difficulty
    private Optional<Question> pickQuestion(Skill skill, String difficulty) {
        List<Question> pool = questionRepository.findBySkillIdAndDifficulty(skill.getId(), difficulty);
        if (pool.isEmpty()) pool = questionRepository.findBySkillId(skill.getId());
        if (pool.isEmpty()) return Optional.empty();
        return Optional.of(pool.get(ThreadLocalRandom.current().nextInt(pool.size())));
    }

    // Normalizes difficulty string to BEGINNER, MEDIUM, or HARD
    private String normalizeDifficulty(String difficulty) {
        if (difficulty == null || difficulty.isBlank()) return "BEGINNER";
        return switch (difficulty.trim().toUpperCase()) {
            case "BEGINNER", "EASY", "LOW" -> "BEGINNER";
            case "MEDIUM", "INTERMEDIATE", "MID" -> "MEDIUM";
            case "HARD", "ADVANCED", "DIFFICULT" -> "HARD";
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid difficulty");
        };
    }

    // Parses JSON option data into key-value map
    private Object parseOptions(String optionData) {
        if (optionData == null || optionData.isBlank()) return Collections.emptyMap();
        try {
            return objectMapper.readValue(optionData, Object.class);
        } catch (Exception e) {
            log.warn("Invalid option JSON, returning raw string");
            return optionData;
        }
    }

    // Returns 404 response exception
    private ResponseStatusException notFound(String msg) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, msg);
    }
}
