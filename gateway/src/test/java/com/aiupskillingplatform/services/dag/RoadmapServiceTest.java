package com.aiupskillingplatform.services.dag;

import com.aiupskillingplatform.dto.dag.RoadmapNodeResponseDTO;
import com.aiupskillingplatform.dto.dag.RoadmapResponseDTO;
import com.aiupskillingplatform.entities.RoadmapNode;
import com.aiupskillingplatform.entities.Skill;
import com.aiupskillingplatform.entities.SkillRoadmap;
import com.aiupskillingplatform.repositories.RoadmapNodeRepository;
import com.aiupskillingplatform.repositories.SkillRepository;
import com.aiupskillingplatform.repositories.SkillRoadmapRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoadmapServiceTest {

    @Mock
    private SkillRepository skillRepository;

    @Mock
    private SkillRoadmapRepository roadmapRepository;

    @Mock
    private RoadmapNodeRepository nodeRepository;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @InjectMocks
    private RoadmapService roadmapService;

    private UUID skillId;
    private Skill skill;
    private SkillRoadmap roadmap;
    private RoadmapNode node1;
    private RoadmapNode node2;

    @BeforeEach
    void setUp() {
        skillId = UUID.randomUUID();

        skill = new Skill();
        skill.setId(skillId);
        skill.setName("Variables and Data Types");
        skill.setSlug("variables-data-types");
        skill.setActive(true);

        roadmap = new SkillRoadmap();
        roadmap.setId(UUID.randomUUID());
        roadmap.setSkill(skill);
        roadmap.setTitle("Variables and Data Types Roadmap");
        roadmap.setDescription("Master Java variables and types");
        roadmap.setVersion(1);
        roadmap.setActive(true);

        node1 = new RoadmapNode();
        node1.setId(UUID.randomUUID());
        node1.setRoadmap(roadmap);
        node1.setTitle("Primitives");
        node1.setDescription("int, double, boolean, char");
        node1.setSlug("primitives");
        node1.setSequenceOrder(1);
        node1.setPrerequisites("[]");
        node1.setResources("[{\"title\":\"Oracle Java Docs\",\"url\":\"https://docs.oracle.com\"}]");

        node2 = new RoadmapNode();
        node2.setId(UUID.randomUUID());
        node2.setRoadmap(roadmap);
        node2.setParentNode(node1);
        node2.setTitle("Reference types");
        node2.setDescription("String, objects, stack vs heap");
        node2.setSlug("reference-types");
        node2.setSequenceOrder(2);
        node2.setPrerequisites("[\"" + node1.getId() + "\"]");
        node2.setResources("[]");
    }

    @Test
    @DisplayName("getRoadmapBySkill - Success returns complete RoadmapResponseDTO")
    @SuppressWarnings("unchecked")
    void getRoadmapBySkill_Success() {
        when(skillRepository.findByIdAndActiveTrue(skillId)).thenReturn(Optional.of(skill));
        when(roadmapRepository.findBySkillIdAndActiveTrue(skillId)).thenReturn(Optional.of(roadmap));
        when(nodeRepository.findByRoadmapIdOrderBySequenceOrderAsc(roadmap.getId()))
                .thenReturn(List.of(node1, node2));

        RoadmapResponseDTO response = roadmapService.getRoadmapBySkill(skillId);

        assertNotNull(response);
        assertEquals(roadmap.getId(), response.roadmapId());
        assertEquals(skillId, response.skillId());
        assertEquals("Variables and Data Types", response.skillName());
        assertEquals("variables-data-types", response.skillSlug());
        assertEquals("Variables and Data Types Roadmap", response.title());
        assertEquals(1, response.version());
        assertEquals(2, response.nodes().size());

        RoadmapNodeResponseDTO dto1 = response.nodes().get(0);
        assertEquals(node1.getId(), dto1.id());
        assertNull(dto1.parentNodeId());
        assertEquals("Primitives", dto1.title());
        assertEquals(1, dto1.sequenceOrder());
        assertInstanceOf(List.class, dto1.prerequisites());
        assertEquals(0, ((List<?>) dto1.prerequisites()).size());
        assertInstanceOf(List.class, dto1.resources());
        List<Map<String, Object>> res1 = (List<Map<String, Object>>) dto1.resources();
        assertEquals(1, res1.size());
        assertEquals("Oracle Java Docs", res1.get(0).get("title"));

        RoadmapNodeResponseDTO dto2 = response.nodes().get(1);
        assertEquals(node2.getId(), dto2.id());
        assertEquals(node1.getId(), dto2.parentNodeId());
        assertEquals("Reference types", dto2.title());
        assertEquals(2, dto2.sequenceOrder());
        assertInstanceOf(List.class, dto2.prerequisites());
        List<String> prereqs2 = (List<String>) dto2.prerequisites();
        assertEquals(1, prereqs2.size());
        assertEquals(node1.getId().toString(), prereqs2.get(0));
    }

    @Test
    @DisplayName("getRoadmapBySkill - Throws EntityNotFoundException when skill not found or inactive")
    void getRoadmapBySkill_SkillNotFound() {
        when(skillRepository.findByIdAndActiveTrue(skillId)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class,
                () -> roadmapService.getRoadmapBySkill(skillId));

        assertTrue(ex.getMessage().contains("Skill not found or inactive: " + skillId));
    }

    @Test
    @DisplayName("getRoadmapBySkill - Throws EntityNotFoundException when active roadmap not found")
    void getRoadmapBySkill_ActiveRoadmapNotFound() {
        when(skillRepository.findByIdAndActiveTrue(skillId)).thenReturn(Optional.of(skill));
        when(roadmapRepository.findBySkillIdAndActiveTrue(skillId)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class,
                () -> roadmapService.getRoadmapBySkill(skillId));

        assertTrue(ex.getMessage().contains("Active roadmap not found for skill: " + skillId));
    }

    @Test
    @DisplayName("getNode - Success returns RoadmapNodeResponseDTO")
    @SuppressWarnings("unchecked")
    void getNode_Success() {
        UUID nodeId = node1.getId();
        when(nodeRepository.findById(nodeId)).thenReturn(Optional.of(node1));

        RoadmapNodeResponseDTO result = roadmapService.getNode(nodeId);

        assertNotNull(result);
        assertEquals(nodeId, result.id());
        assertNull(result.parentNodeId());
        assertEquals("Primitives", result.title());
        assertEquals("int, double, boolean, char", result.description());
        assertEquals("primitives", result.slug());
        assertEquals(1, result.sequenceOrder());
        assertInstanceOf(List.class, result.resources());
        assertEquals(1, ((List<?>) result.resources()).size());
    }

    @Test
    @DisplayName("getNode - Throws EntityNotFoundException when node not found")
    void getNode_NotFound() {
        UUID nodeId = UUID.randomUUID();
        when(nodeRepository.findById(nodeId)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class,
                () -> roadmapService.getNode(nodeId));

        assertTrue(ex.getMessage().contains("Roadmap node not found: " + nodeId));
    }

    @Test
    @DisplayName("parseJson - Gracefully falls back to empty List on invalid JSON")
    void parseJson_InvalidJsonFallback() {
        node1.setPrerequisites("INVALID_JSON{[[");
        node1.setResources("NOT_A_JSON_STRING");

        when(nodeRepository.findById(node1.getId())).thenReturn(Optional.of(node1));

        RoadmapNodeResponseDTO result = roadmapService.getNode(node1.getId());

        assertNotNull(result);
        assertNotNull(result.prerequisites());
        assertInstanceOf(List.class, result.prerequisites());
        assertEquals(0, ((List<?>) result.prerequisites()).size());

        assertNotNull(result.resources());
        assertInstanceOf(List.class, result.resources());
        assertEquals(0, ((List<?>) result.resources()).size());
    }
}
