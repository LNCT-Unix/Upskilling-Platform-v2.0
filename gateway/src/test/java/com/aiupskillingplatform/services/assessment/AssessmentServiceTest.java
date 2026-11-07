package com.aiupskillingplatform.services.assessment;

import com.aiupskillingplatform.dto.assessment.*;
import com.aiupskillingplatform.entities.*;
import com.aiupskillingplatform.enums.Role;
import com.aiupskillingplatform.enums.UserStatus;
import com.aiupskillingplatform.repositories.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssessmentServiceTest {

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private SkillRepository skillRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserSkillMasteryRepository masteryRepository;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private AssessmentService assessmentService;

    private User testUser;
    private Skill skill1;
    private Skill skill2;
    private Authentication auth;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("student@example.com");
        testUser.setFullName("Test Student");
        testUser.setRole(Role.USER);
        testUser.setStatus(UserStatus.ACTIVE);

        skill1 = new Skill();
        skill1.setId(UUID.randomUUID());
        skill1.setName("Variables and Data Types");
        skill1.setSlug("variables-data-types");

        skill2 = new Skill();
        skill2.setId(UUID.randomUUID());
        skill2.setName("Classes and Objects");
        skill2.setSlug("classes-objects");

        auth = new TestingAuthenticationToken("student@example.com", "credentials", "ROLE_USER");
    }

    @Test
    void testStartAssessmentReturnsFirstQuestion() {
        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(testUser));
        when(skillRepository.findBySlugAndActiveTrue("variables-data-types")).thenReturn(Optional.of(skill1));

        Question q1 = new Question();
        q1.setId(UUID.randomUUID());
        q1.setQuestionText("What is a variable?");
        q1.setDifficulty("BEGINNER");
        q1.setOptionData("{\"A\": \"Container\"}");

        when(questionRepository.findBySkillIdAndDifficulty(eq(skill1.getId()), eq("BEGINNER")))
                .thenReturn(List.of(q1));

        AssessmentStepResponse response = assessmentService.start("backend-development", "BEGINNER", auth);

        assertNotNull(response);
        assertEquals(0, response.questionIndex());
        assertEquals(1, response.questionNumber());
        assertEquals(12, response.totalQuestions());
        assertFalse(response.completed());
        assertEquals("Variables and Data Types", response.skill().name());
        assertEquals(q1.getId(), response.question().id());
    }

    @Test
    void testStartAssessmentUnauthenticatedThrows401() {
        assertThrows(ResponseStatusException.class, () ->
                assessmentService.start("backend-development", "BEGINNER", null));
    }

    @Test
    void testStartAssessmentUnknownTrackThrows404() {
        assertThrows(ResponseStatusException.class, () ->
                assessmentService.start("unknown-track", "BEGINNER", auth));
    }

    @Test
    void testSubmitCorrectAnswerUnlocksSkillAndReturnsNext() {
        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(testUser));

        UUID q1Id = UUID.randomUUID();
        Question q1 = new Question();
        q1.setId(q1Id);
        q1.setQuestionText("What is a variable?");
        q1.setCorrectAnswer("A");
        q1.setExplanation("A variable stores data values.");

        when(questionRepository.findById(q1Id)).thenReturn(Optional.of(q1));
        when(questionRepository.findSkillsByQuestionId(q1Id)).thenReturn(List.of(skill1));
        when(masteryRepository.findByUserIdAndSkillId(testUser.getId(), skill1.getId())).thenReturn(Optional.empty());

        when(skillRepository.findBySlugAndActiveTrue("classes-objects")).thenReturn(Optional.of(skill2));
        Question q2 = new Question();
        q2.setId(UUID.randomUUID());
        q2.setQuestionText("What is a class?");
        q2.setDifficulty("BEGINNER");
        when(questionRepository.findBySkillIdAndDifficulty(eq(skill2.getId()), eq("BEGINNER")))
                .thenReturn(List.of(q2));

        SubmitAnswerRequest request = new SubmitAnswerRequest(q1Id, "A", "BEGINNER");
        AnswerResultResponse result = assessmentService.submitAnswer("backend-development", request, auth);

        assertTrue(result.correct());
        assertEquals("A", result.correctAnswer());
        assertEquals("A variable stores data values.", result.explanation());
        assertNotNull(result.next());
        assertEquals(1, result.next().questionIndex());
        assertEquals(2, result.next().questionNumber());
        assertEquals("Classes and Objects", result.next().skill().name());

        ArgumentCaptor<UserSkillMastery> captor = ArgumentCaptor.forClass(UserSkillMastery.class);
        verify(masteryRepository).save(captor.capture());
        assertEquals("UNLOCKED", captor.getValue().getStatus());
    }

    @Test
    void testSubmitIncorrectAnswerDoesNotUnlockSkill() {
        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(testUser));

        UUID q1Id = UUID.randomUUID();
        Question q1 = new Question();
        q1.setId(q1Id);
        q1.setQuestionText("What is a variable?");
        q1.setCorrectAnswer("A");
        q1.setExplanation("A variable stores data values.");

        when(questionRepository.findById(q1Id)).thenReturn(Optional.of(q1));
        when(questionRepository.findSkillsByQuestionId(q1Id)).thenReturn(List.of(skill1));

        when(skillRepository.findBySlugAndActiveTrue("classes-objects")).thenReturn(Optional.of(skill2));
        Question q2 = new Question();
        q2.setId(UUID.randomUUID());
        q2.setQuestionText("What is a class?");
        q2.setDifficulty("BEGINNER");
        when(questionRepository.findBySkillIdAndDifficulty(eq(skill2.getId()), eq("BEGINNER")))
                .thenReturn(List.of(q2));

        SubmitAnswerRequest request = new SubmitAnswerRequest(q1Id, "B", "BEGINNER");
        AnswerResultResponse result = assessmentService.submitAnswer("backend-development", request, auth);

        assertFalse(result.correct());
        verify(masteryRepository, never()).save(any());
        assertEquals(1, result.next().questionIndex());
    }

    @Test
    void testSubmitAnswerForFinalQuestionCompletesAssessment() {
        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(testUser));

        Skill skill12 = new Skill();
        skill12.setId(UUID.randomUUID());
        skill12.setName("Dependency Injection");
        skill12.setSlug("dependency-injection-spring-beans");

        UUID q12Id = UUID.randomUUID();
        Question q12 = new Question();
        q12.setId(q12Id);
        q12.setCorrectAnswer("C");
        q12.setExplanation("Spring IoC injects beans.");

        when(questionRepository.findById(q12Id)).thenReturn(Optional.of(q12));
        when(questionRepository.findSkillsByQuestionId(q12Id)).thenReturn(List.of(skill12));

        SubmitAnswerRequest request = new SubmitAnswerRequest(q12Id, "C", "BEGINNER");
        AnswerResultResponse result = assessmentService.submitAnswer("backend-development", request, auth);

        assertTrue(result.correct());
        assertTrue(result.next().completed());
        assertNull(result.next().question());
        assertNull(result.next().skill());
        assertEquals(12, result.next().questionIndex());
    }
}
