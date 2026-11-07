package com.aiupskillingplatform.controllers.IrtAssessment;

import com.aiupskillingplatform.dto.assessment.*;
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

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private AssessmentService assessmentService;

    @InjectMocks
    private AssessmentController assessmentController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(assessmentController).build();
    }

    @Test
    void testStartEndpointReturnsFirstQuestionStep() throws Exception {
        String trackSlug = "backend-development";
        AssessmentSkillDTO skillDTO = new AssessmentSkillDTO(
                UUID.randomUUID(), "Variables and Data Types", "variables-data-types", "Fundamentals", UUID.randomUUID(), "LOCKED");
        AssessmentQuestionDTO questionDTO = new AssessmentQuestionDTO(
                UUID.randomUUID(), "What is an int?", "MCQ", Map.of("A", "Number"), "BEGINNER");
        AssessmentStepResponse stepResponse = new AssessmentStepResponse(
                0, 1, 12, false, skillDTO, questionDTO, "Question 1 of 12");

        when(assessmentService.start(eq(trackSlug), eq("BEGINNER"), any())).thenReturn(stepResponse);

        mockMvc.perform(get("/api/tracks/" + trackSlug + "/assessment/start")
                        .param("difficulty", "BEGINNER"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.questionIndex").value(0))
                .andExpect(jsonPath("$.questionNumber").value(1))
                .andExpect(jsonPath("$.totalQuestions").value(12))
                .andExpect(jsonPath("$.completed").value(false))
                .andExpect(jsonPath("$.skill.name").value("Variables and Data Types"))
                .andExpect(jsonPath("$.question.text").value("What is an int?"));
    }

    @Test
    void testSubmitAnswerEndpointReturnsGradedResultAndNextStep() throws Exception {
        String trackSlug = "backend-development";
        UUID questionId = UUID.randomUUID();

        AssessmentSkillDTO skillDTO = new AssessmentSkillDTO(
                UUID.randomUUID(), "Classes and Objects", "classes-objects", "OOP", UUID.randomUUID(), "LOCKED");
        AssessmentQuestionDTO questionDTO = new AssessmentQuestionDTO(
                UUID.randomUUID(), "What is a class?", "MCQ", Map.of("A", "Blueprint"), "BEGINNER");
        AssessmentStepResponse nextStep = new AssessmentStepResponse(
                1, 2, 12, false, skillDTO, questionDTO, "Question 2 of 12");

        AnswerResultResponse resultResponse = new AnswerResultResponse(
                true, "A", "A variable is a container", nextStep);

        when(assessmentService.submitAnswer(eq(trackSlug), any(SubmitAnswerRequest.class), any())).thenReturn(resultResponse);

        SubmitAnswerRequest request = new SubmitAnswerRequest(questionId, "A", "BEGINNER");

        mockMvc.perform(post("/api/tracks/" + trackSlug + "/assessment/answers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correct").value(true))
                .andExpect(jsonPath("$.correctAnswer").value("A"))
                .andExpect(jsonPath("$.explanation").value("A variable is a container"))
                .andExpect(jsonPath("$.next.questionIndex").value(1))
                .andExpect(jsonPath("$.next.questionNumber").value(2))
                .andExpect(jsonPath("$.next.skill.name").value("Classes and Objects"));
    }
}
