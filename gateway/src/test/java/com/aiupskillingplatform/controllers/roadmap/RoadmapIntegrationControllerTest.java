package com.aiupskillingplatform.controllers.roadmap;

import com.aiupskillingplatform.dto.roadmap.personalized.UpdateRoadmapProgressRequestDTO;
import com.aiupskillingplatform.dto.roadmap.personalized.UserGenerateRoadmapRequestDTO;
import com.aiupskillingplatform.entities.User;
import com.aiupskillingplatform.repositories.UserRepository;
import com.aiupskillingplatform.services.roadmap.RoadmapIntegrationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class RoadmapIntegrationControllerTest {

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @Mock
    private RoadmapIntegrationService roadmapIntegrationService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RoadmapIntegrationController controller;

    private User testUser;
    private Authentication testAuth;

    @BeforeEach
    void setUp() {
        HandlerMethodArgumentResolver authResolver = new HandlerMethodArgumentResolver() {
            @Override
            public boolean supportsParameter(MethodParameter parameter) {
                return Authentication.class.isAssignableFrom(parameter.getParameterType());
            }

            @Override
            public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                          NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
                Principal principal = webRequest.getUserPrincipal();
                return principal instanceof Authentication ? principal : null;
            }
        };

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setCustomArgumentResolvers(authResolver)
                .build();

        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("developer@example.com");
        testUser.setFullName("Test Developer");

        testAuth = new UsernamePasswordAuthenticationToken(
                testUser.getEmail(),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    @Test
    @DisplayName("POST /api/roadmaps/generate - Unauthenticated returns 401")
    void generateRoadmap_Unauthenticated_Returns401() throws Exception {
        mockMvc.perform(post("/api/roadmaps/generate")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/roadmaps/generate - Authenticated returns 200 or 201 with generated roadmap")
    void generateRoadmap_Authenticated_Success() throws Exception {
        when(userRepository.findByEmail("developer@example.com")).thenReturn(Optional.of(testUser));

        String mockResponseBody = "{\"success\":true,\"data\":{\"userId\":\"" + testUser.getId() + "\",\"title\":\"Backend Path\"}}";
        when(roadmapIntegrationService.generateRoadmap(eq(testUser), any())).thenReturn(
                ResponseEntity.ok(mockResponseBody)
        );

        UserGenerateRoadmapRequestDTO request = new UserGenerateRoadmapRequestDTO();
        request.setTargetRole("Backend Engineer");
        request.setStudyHoursPerWeek(15);

        mockMvc.perform(post("/api/roadmaps/generate")
                        .principal(testAuth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().json(mockResponseBody));
    }

    @Test
    @DisplayName("GET /api/roadmaps/me - Unauthenticated returns 401")
    void getActiveRoadmap_Unauthenticated_Returns401() throws Exception {
        mockMvc.perform(get("/api/roadmaps/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/roadmaps/me - Authenticated returns 200 with active roadmap")
    void getActiveRoadmap_Authenticated_Success() throws Exception {
        when(userRepository.findByEmail("developer@example.com")).thenReturn(Optional.of(testUser));

        String mockResponseBody = "{\"success\":true,\"data\":{\"status\":\"ACTIVE\",\"version\":1}}";
        when(roadmapIntegrationService.getActiveRoadmap(eq(testUser.getId()), eq("track-1"))).thenReturn(
                ResponseEntity.ok(mockResponseBody)
        );

        mockMvc.perform(get("/api/roadmaps/me")
                        .principal(testAuth)
                        .param("trackId", "track-1"))
                .andExpect(status().isOk())
                .andExpect(content().json(mockResponseBody));
    }

    @Test
    @DisplayName("GET /api/roadmaps/me/history - Authenticated returns 200 with versions")
    void getRoadmapHistory_Authenticated_Success() throws Exception {
        when(userRepository.findByEmail("developer@example.com")).thenReturn(Optional.of(testUser));

        String mockResponseBody = "{\"success\":true,\"data\":[{\"version\":2},{\"version\":1}]}";
        when(roadmapIntegrationService.getRoadmapHistory(eq(testUser.getId()), eq("track-1"))).thenReturn(
                ResponseEntity.ok(mockResponseBody)
        );

        mockMvc.perform(get("/api/roadmaps/me/history")
                        .principal(testAuth)
                        .param("trackId", "track-1"))
                .andExpect(status().isOk())
                .andExpect(content().json(mockResponseBody));
    }

    @Test
    @DisplayName("PATCH /api/roadmaps/{roadmapId}/progress - Authenticated updates progress")
    void updateProgress_Authenticated_Success() throws Exception {
        when(userRepository.findByEmail("developer@example.com")).thenReturn(Optional.of(testUser));

        String roadmapId = "60c72b2f9b1d8b2badbee123";
        UpdateRoadmapProgressRequestDTO req = UpdateRoadmapProgressRequestDTO.builder()
                .stepId("step-1")
                .topicId("topic-1")
                .status("COMPLETED")
                .build();

        String mockResponseBody = "{\"success\":true,\"data\":{\"percentComplete\":10}}";
        when(roadmapIntegrationService.updateProgress(eq(roadmapId), eq(testUser.getId()), any(UpdateRoadmapProgressRequestDTO.class))).thenReturn(
                ResponseEntity.ok(mockResponseBody)
        );

        mockMvc.perform(patch("/api/roadmaps/" + roadmapId + "/progress")
                        .principal(testAuth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().json(mockResponseBody));
    }
}
