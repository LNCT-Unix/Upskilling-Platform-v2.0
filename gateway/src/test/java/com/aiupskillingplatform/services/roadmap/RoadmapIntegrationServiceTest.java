package com.aiupskillingplatform.services.roadmap;

import com.aiupskillingplatform.dto.roadmap.personalized.GenerateRoadmapPayloadDTO;
import com.aiupskillingplatform.dto.roadmap.personalized.UpdateRoadmapProgressRequestDTO;
import com.aiupskillingplatform.dto.roadmap.personalized.UserGenerateRoadmapRequestDTO;
import com.aiupskillingplatform.entities.*;
import com.aiupskillingplatform.repositories.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoadmapIntegrationServiceTest {

    @Mock
    private NodeRoadmapClient nodeRoadmapClient;

    @Mock
    private AssessmentAttemptRepository attemptRepository;

    @Mock
    private AssessmentResponseRepository responseRepository;

    @Mock
    private TrackRepository trackRepository;

    @Mock
    private SkillRepository skillRepository;

    @Mock
    private SkillDependencyRepository dependencyRepository;

    @Mock
    private UserSkillMasteryRepository masteryRepository;

    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private RoadmapIntegrationService service;

    private User user;
    private Track track;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@example.com");

        track = new Track();
        track.setId(UUID.randomUUID());
        track.setName("Backend Development");
        track.setSlug("backend-development");
    }

    @Test
    @DisplayName("generateRoadmap builds payload with graded assessment, mastery, and dependencies")
    void generateRoadmap_BuildsPayloadCorrectly() {
        when(trackRepository.findBySlug("backend-development")).thenReturn(Optional.of(track));

        AssessmentAttempt attempt = new AssessmentAttempt();
        attempt.setId(UUID.randomUUID());
        attempt.setUser(user);
        attempt.setTrack(track);
        attempt.setStatus("COMPLETED");
        attempt.setDifficulty("BEGINNER");
        attempt.setTotalQuestions(12);
        attempt.setCorrectCount(8);
        attempt.setWrongCount(4);
        attempt.setScore(66.7);
        attempt.setStartedAt(Instant.now());
        attempt.setCompletedAt(Instant.now());

        when(attemptRepository.findTopByUserIdAndTrackSlugAndStatusOrderByStartedAtDesc(user.getId(), "backend-development", "COMPLETED"))
                .thenReturn(Optional.of(attempt));

        Question question = new Question();
        question.setId(UUID.randomUUID());
        question.setQuestionText("What is encapsulation?");
        question.setDifficulty("BEGINNER");

        Skill skill = new Skill();
        skill.setId(UUID.randomUUID());
        skill.setName("Encapsulation");
        skill.setSlug("encapsulation");

        AssessmentResponse response = new AssessmentResponse();
        response.setId(UUID.randomUUID());
        response.setAttempt(attempt);
        response.setQuestion(question);
        response.setQuestionOrder(1);
        response.setIsCorrect(true);

        when(responseRepository.findByAttemptIdOrderByQuestionOrderAsc(attempt.getId()))
                .thenReturn(List.of(response));
        when(questionRepository.findSkillsByQuestionId(question.getId()))
                .thenReturn(List.of(skill));

        when(skillRepository.findByTrackIdAndActiveTrue(track.getId()))
                .thenReturn(List.of(skill));

        UserSkillMastery mastery = new UserSkillMastery();
        mastery.setUser(user);
        mastery.setSkill(skill);
        mastery.setStatus("UNLOCKED");
        mastery.setMasteryScore(80.0);

        when(masteryRepository.findByUserId(user.getId()))
                .thenReturn(List.of(mastery));

        Skill prereq = new Skill();
        prereq.setSlug("classes-objects");
        SkillDependency dep = new SkillDependency();
        dep.setPrerequisiteSkill(prereq);
        dep.setDependentSkill(skill);

        when(dependencyRepository.findByTrackId(track.getId()))
                .thenReturn(List.of(dep));

        when(nodeRoadmapClient.generateRoadmap(any(GenerateRoadmapPayloadDTO.class)))
                .thenReturn(ResponseEntity.ok("{\"success\":true}"));

        UserGenerateRoadmapRequestDTO request = new UserGenerateRoadmapRequestDTO();
        request.setTrackSlug("backend-development");
        request.setTargetRole("Senior Backend Developer");
        request.setStudyHoursPerWeek(12);
        request.setRequestId("req-12345");

        ResponseEntity<String> result = service.generateRoadmap(user, request);

        assertThat(result.getStatusCode().is2xxSuccessful()).isTrue();

        ArgumentCaptor<GenerateRoadmapPayloadDTO> captor = ArgumentCaptor.forClass(GenerateRoadmapPayloadDTO.class);
        verify(nodeRoadmapClient).generateRoadmap(captor.capture());

        GenerateRoadmapPayloadDTO payload = captor.getValue();
        assertThat(payload.getUserId()).isEqualTo(user.getId().toString());
        assertThat(payload.getTrackId()).isEqualTo(track.getId().toString());
        assertThat(payload.getTargetRole()).isEqualTo("Senior Backend Developer");
        assertThat(payload.getStudyHoursPerWeek()).isEqualTo(12);
        assertThat(payload.getRequestId()).isEqualTo("req-12345");
        assertThat(payload.getAssessment().getAssessmentId()).isEqualTo(attempt.getId().toString());
        assertThat(payload.getAssessment().getCorrectCount()).isEqualTo(8);
        assertThat(payload.getQuestions()).hasSize(1);
        assertThat(payload.getQuestions().get(0).getSkillSlug()).isEqualTo("encapsulation");
        assertThat(payload.getQuestions().get(0).getIsCorrect()).isTrue();
        assertThat(payload.getSkills()).hasSize(1);
        assertThat(payload.getSkills().get(0).getStatus()).isEqualTo("UNLOCKED");
        assertThat(payload.getDependencies()).hasSize(1);
        assertThat(payload.getDependencies().get(0).getPrerequisite()).isEqualTo("classes-objects");
    }

    @Test
    @DisplayName("getActiveRoadmap delegates to NodeRoadmapClient")
    void getActiveRoadmap_Delegates() {
        when(nodeRoadmapClient.getActiveRoadmap(user.getId().toString(), "track-1"))
                .thenReturn(ResponseEntity.ok("{\"success\":true}"));

        ResponseEntity<String> res = service.getActiveRoadmap(user.getId(), "track-1");
        assertThat(res.getStatusCode().is2xxSuccessful()).isTrue();
        verify(nodeRoadmapClient).getActiveRoadmap(user.getId().toString(), "track-1");
    }

    @Test
    @DisplayName("updateProgress delegates to NodeRoadmapClient")
    void updateProgress_Delegates() {
        UpdateRoadmapProgressRequestDTO req = UpdateRoadmapProgressRequestDTO.builder()
                .stepId("step-1")
                .status("COMPLETED")
                .build();

        when(nodeRoadmapClient.updateProgress("roadmap-123", user.getId().toString(), req))
                .thenReturn(ResponseEntity.ok("{\"success\":true}"));

        ResponseEntity<String> res = service.updateProgress("roadmap-123", user.getId(), req);
        assertThat(res.getStatusCode().is2xxSuccessful()).isTrue();
        verify(nodeRoadmapClient).updateProgress("roadmap-123", user.getId().toString(), req);
    }
}
