package com.aiupskillingplatform.services.assessment;

import com.aiupskillingplatform.dto.assessment.AssessmentQuestionRequestDTO;
import com.aiupskillingplatform.dto.assessment.AssessmentQuestionResponseDTO;
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
    private UserSkillMasteryRepository userSkillMasteryRepository;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private AssessmentService assessmentService;

    private User testUser;
    private Skill skill1;
    private Skill skill2;

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
    }

    @Test
    void testPredefinedSkillSequenceContains12Skills() {
        List<String> slugs = assessmentService.getAssessmentSkillSlugs("backend-development");
        assertEquals(12, slugs.size());
        assertEquals("variables-data-types", slugs.get(0));
        assertEquals("classes-objects", slugs.get(1));
        assertEquals("dependency-injection-spring-beans", slugs.get(11));
    }

    @Test
    void testInitialQuestionWhenCorrectAnsIsZero() {
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(skillRepository.findBySlugAndActiveTrue("variables-data-types")).thenReturn(Optional.of(skill1));

        Question q1 = new Question();
        q1.setId(UUID.randomUUID());
        q1.setQuestionText("What is a variable?");
        q1.setDifficulty("BEGINNER");
        q1.setCorrectAnswer("B");

        when(questionRepository.findBySkillIdAndDifficulty(eq(skill1.getId()), eq("BEGINNER")))
                .thenReturn(List.of(q1));

        AssessmentQuestionRequestDTO request = AssessmentQuestionRequestDTO.builder()
                .correctAns(0)
                .difficulty("BEGINNER")
                .trackSlug("backend-development")
                .userId(testUser.getId())
                .build();

        AssessmentQuestionResponseDTO response = assessmentService.getNextQuestion(request, null);

        assertNotNull(response);
        assertEquals(0, response.getQuestionIndex());
        assertEquals(1, response.getQuestionNumber());
        assertEquals(12, response.getTotalQuestions());
        assertFalse(response.isCompleted());
        assertEquals(skill1.getId(), response.getSkill().id());
        assertEquals("Variables and Data Types", response.getSkill().name());
        assertEquals(q1.getId(), response.getQuestion().id());

        // Mastery not updated on question start
        verify(userSkillMasteryRepository, never()).save(any());
    }

    @Test
    void testCorrectAnswerUpdatesSkillStatusToUnlockedAndMovesToNextSkill() {
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(skillRepository.findById(skill1.getId())).thenReturn(Optional.of(skill1));
        when(skillRepository.findBySlugAndActiveTrue("classes-objects")).thenReturn(Optional.of(skill2));
        when(userSkillMasteryRepository.findByUserIdAndSkillId(testUser.getId(), skill1.getId()))
                .thenReturn(Optional.empty());

        Question q2 = new Question();
        q2.setId(UUID.randomUUID());
        q2.setQuestionText("What is OOP?");
        q2.setDifficulty("BEGINNER");

        when(questionRepository.findBySkillIdAndDifficulty(eq(skill2.getId()), eq("BEGINNER")))
                .thenReturn(List.of(q2));

        AssessmentQuestionRequestDTO request = AssessmentQuestionRequestDTO.builder()
                .correctAns(1) // 1 = Answered correctly
                .difficulty("BEGINNER")
                .trackSlug("backend-development")
                .userId(testUser.getId())
                .previousSkillId(skill1.getId())
                .questionIndex(0)
                .build();

        AssessmentQuestionResponseDTO response = assessmentService.getNextQuestion(request, null);

        assertNotNull(response);
        assertEquals(1, response.getQuestionIndex());
        assertEquals(2, response.getQuestionNumber());
        assertEquals("Classes and Objects", response.getSkill().name());

        // Verify skill was saved with UNLOCKED status
        ArgumentCaptor<UserSkillMastery> captor = ArgumentCaptor.forClass(UserSkillMastery.class);
        verify(userSkillMasteryRepository).save(captor.capture());
        UserSkillMastery saved = captor.getValue();
        assertEquals("UNLOCKED", saved.getStatus());
        assertEquals(0.0, saved.getMasteryScore());
        assertEquals(skill1, saved.getSkill());
        assertEquals(testUser, saved.getUser());
    }

    @Test
    void testIncorrectAnswerDoesNotUnlockSkill() {
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(skillRepository.findBySlugAndActiveTrue("classes-objects")).thenReturn(Optional.of(skill2));

        Question q2 = new Question();
        q2.setId(UUID.randomUUID());
        q2.setQuestionText("What is OOP?");
        q2.setDifficulty("BEGINNER");

        when(questionRepository.findBySkillIdAndDifficulty(eq(skill2.getId()), eq("BEGINNER")))
                .thenReturn(List.of(q2));

        AssessmentQuestionRequestDTO request = AssessmentQuestionRequestDTO.builder()
                .correctAns(2) // 2 = Answered incorrectly
                .difficulty("BEGINNER")
                .trackSlug("backend-development")
                .userId(testUser.getId())
                .previousSkillId(skill1.getId())
                .questionIndex(0)
                .build();

        AssessmentQuestionResponseDTO response = assessmentService.getNextQuestion(request, null);

        assertNotNull(response);
        assertEquals(1, response.getQuestionIndex());
        assertEquals(2, response.getQuestionNumber());

        // Verify save was NOT called
        verify(userSkillMasteryRepository, never()).save(any());
    }

    @Test
    void testAssessmentCompletesAfter12Questions() {
        Skill skill12 = new Skill();
        skill12.setId(UUID.randomUUID());
        skill12.setName("Dependency Injection and Spring Beans");
        skill12.setSlug("dependency-injection-spring-beans");

        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(skillRepository.findById(skill12.getId())).thenReturn(Optional.of(skill12));
        when(userSkillMasteryRepository.findByUserIdAndSkillId(testUser.getId(), skill12.getId()))
                .thenReturn(Optional.empty());

        AssessmentQuestionRequestDTO request = AssessmentQuestionRequestDTO.builder()
                .correctAns(1)
                .trackSlug("backend-development")
                .userId(testUser.getId())
                .previousSkillId(skill12.getId())
                .questionIndex(11) // 12th question (0-based)
                .build();

        AssessmentQuestionResponseDTO response = assessmentService.getNextQuestion(request, null);

        assertNotNull(response);
        assertTrue(response.isCompleted());
        assertEquals(12, response.getQuestionIndex());
        assertEquals(12, response.getQuestionNumber());
        assertNull(response.getQuestion());
        assertNull(response.getSkill());
        assertTrue(response.getMessage().contains("Assessment completed"));

        // Skill was still unlocked
        verify(userSkillMasteryRepository).save(any());
    }
}
