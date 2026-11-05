package com.aiupskillingplatform.controllers.IrtAssessment;

import com.aiupskillingplatform.dto.assessment.AssessmentQuestionRequestDTO;
import com.aiupskillingplatform.dto.assessment.AssessmentQuestionResponseDTO;
import com.aiupskillingplatform.dto.assessment.AssessmentSkillDTO;
import com.aiupskillingplatform.dto.assessment.QuestionDTO;
import com.aiupskillingplatform.services.assessment.AssessmentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AssessmentControllerTest {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private AssessmentService assessmentService;

    @InjectMocks
    private AssessmentController assessmentController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(assessmentController).build();
    }

    @Test
    void testPostGetQuestionWithSlugPathVariable() throws Exception {
        String trackSlug = "backend-development";
        AssessmentQuestionResponseDTO mockResponse = AssessmentQuestionResponseDTO.builder()
                .questionIndex(0)
                .questionNumber(1)
                .totalQuestions(12)
                .isCompleted(false)
                .skill(new AssessmentSkillDTO(UUID.randomUUID(), "Variables and Data Types", "variables-data-types", "Programming Fundamentals", UUID.randomUUID(), "UNLOCKED"))
                .question(new QuestionDTO(UUID.randomUUID(), "What is an int?", "MCQ", Map.of("A", "Number"), "BEGINNER", "A", "Whole numbers"))
                .message("Question 1 of 12 fetched successfully")
                .build();

        when(assessmentService.getNextQuestion(eq(trackSlug), any(), any())).thenReturn(mockResponse);

        AssessmentQuestionRequestDTO request = AssessmentQuestionRequestDTO.builder()
                .correctAns(0)
                .difficulty("BEGINNER")
                .build();

        mockMvc.perform(post("/track/" + trackSlug + "/assesment/getquestion")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.questionIndex").value(0))
                .andExpect(jsonPath("$.questionNumber").value(1))
                .andExpect(jsonPath("$.totalQuestions").value(12))
                .andExpect(jsonPath("$.isCompleted").value(false))
                .andExpect(jsonPath("$.skill.name").value("Variables and Data Types"))
                .andExpect(jsonPath("$.question.questionText").value("What is an int?"));
    }

    @Test
    void testGetQuestionViaGetWithPathTrackSlug() throws Exception {
        String trackSlug = "backend-development";
        AssessmentQuestionResponseDTO mockResponse = AssessmentQuestionResponseDTO.builder()
                .questionIndex(1)
                .questionNumber(2)
                .totalQuestions(12)
                .isCompleted(false)
                .skill(new AssessmentSkillDTO(UUID.randomUUID(), "Classes and Objects", "classes-objects", "OOP", UUID.randomUUID(), "UNLOCKED"))
                .question(new QuestionDTO(UUID.randomUUID(), "What is a Class?", "MCQ", Map.of("A", "Blueprint"), "BEGINNER", "A", "Blueprint"))
                .message("Question 2 of 12 fetched successfully")
                .build();

        when(assessmentService.getNextQuestion(eq(trackSlug), any(), any())).thenReturn(mockResponse);

        mockMvc.perform(get("/track/" + trackSlug + "/assesment/getquestion")
                        .param("correct_ans", "1")
                        .param("difficulty", "BEGINNER"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.questionIndex").value(1))
                .andExpect(jsonPath("$.questionNumber").value(2))
                .andExpect(jsonPath("$.skill.name").value("Classes and Objects"));
    }

    @Test
    void testPostGetQuestionWithoutSlugDefaultFallback() throws Exception {
        AssessmentQuestionResponseDTO mockResponse = AssessmentQuestionResponseDTO.builder()
                .questionIndex(0)
                .questionNumber(1)
                .totalQuestions(12)
                .isCompleted(false)
                .skill(new AssessmentSkillDTO(UUID.randomUUID(), "Variables and Data Types", "variables-data-types", "Programming Fundamentals", UUID.randomUUID(), "UNLOCKED"))
                .question(new QuestionDTO(UUID.randomUUID(), "What is an int?", "MCQ", Map.of("A", "Number"), "BEGINNER", "A", "Whole numbers"))
                .message("Question 1 of 12 fetched successfully")
                .build();

        when(assessmentService.getNextQuestion(eq(null), any(), any())).thenReturn(mockResponse);

        AssessmentQuestionRequestDTO request = AssessmentQuestionRequestDTO.builder()
                .correctAns(0)
                .difficulty("BEGINNER")
                .build();

        mockMvc.perform(post("/track/assesment/getquestion")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.questionIndex").value(0))
                .andExpect(jsonPath("$.questionNumber").value(1))
                .andExpect(jsonPath("$.totalQuestions").value(12));
    }
}
