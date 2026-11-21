package com.aiupskillingplatform.controllers.dag;

import com.aiupskillingplatform.dto.dag.RoadmapNodeResponseDTO;
import com.aiupskillingplatform.dto.dag.RoadmapResponseDTO;
import com.aiupskillingplatform.services.dag.RoadmapService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class RoadmapControllerTest {

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @Mock
    private RoadmapService roadmapService;

    @InjectMocks
    private RoadmapController roadmapController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(roadmapController)
                .setMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                .setControllerAdvice(new DagExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("GET /api/roadmaps/skills/{skillId} - Success returns 200 and roadmap details")
    void getRoadmapBySkill_Success() throws Exception {
        UUID skillId = UUID.randomUUID();
        UUID roadmapId = UUID.randomUUID();
        UUID nodeId1 = UUID.randomUUID();
        UUID nodeId2 = UUID.randomUUID();

        List<Object> emptyPrereqs = List.of();
        List<Object> resources1 = List.of(
                Map.of("title", "Java Primitives", "url", "https://docs.oracle.com", "type", "documentation")
        );

        List<Object> prereqs2 = List.of(nodeId1.toString());

        RoadmapNodeResponseDTO node1 = new RoadmapNodeResponseDTO(
                nodeId1, null, "Primitives", "int, double, boolean, char",
                "primitives", 1, emptyPrereqs, resources1);

        RoadmapNodeResponseDTO node2 = new RoadmapNodeResponseDTO(
                nodeId2, nodeId1, "Reference types", "String, objects, stack vs heap",
                "reference-types", 2, prereqs2, List.of());

        RoadmapResponseDTO responseDTO = new RoadmapResponseDTO(
                roadmapId, skillId, "Variables and Data Types", "variables-data-types",
                "Variables and Data Types Roadmap", "Learn Java variables and types",
                1, List.of(node1, node2)
        );

        when(roadmapService.getRoadmapBySkill(eq(skillId))).thenReturn(responseDTO);

        mockMvc.perform(get("/api/roadmaps/skills/{skillId}", skillId)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.roadmapId").value(roadmapId.toString()))
                .andExpect(jsonPath("$.skillId").value(skillId.toString()))
                .andExpect(jsonPath("$.skillName").value("Variables and Data Types"))
                .andExpect(jsonPath("$.skillSlug").value("variables-data-types"))
                .andExpect(jsonPath("$.title").value("Variables and Data Types Roadmap"))
                .andExpect(jsonPath("$.version").value(1))
                .andExpect(jsonPath("$.nodes").isArray())
                .andExpect(jsonPath("$.nodes.length()").value(2))
                .andExpect(jsonPath("$.nodes[0].id").value(nodeId1.toString()))
                .andExpect(jsonPath("$.nodes[0].title").value("Primitives"))
                .andExpect(jsonPath("$.nodes[0].sequenceOrder").value(1))
                .andExpect(jsonPath("$.nodes[0].resources[0].title").value("Java Primitives"))
                .andExpect(jsonPath("$.nodes[1].id").value(nodeId2.toString()))
                .andExpect(jsonPath("$.nodes[1].parentNodeId").value(nodeId1.toString()))
                .andExpect(jsonPath("$.nodes[1].sequenceOrder").value(2));
    }

    @Test
    @DisplayName("GET /api/roadmaps/skills/{skillId} - When skill/roadmap not found returns 404")
    void getRoadmapBySkill_NotFound() throws Exception {
        UUID skillId = UUID.randomUUID();

        when(roadmapService.getRoadmapBySkill(eq(skillId)))
                .thenThrow(new EntityNotFoundException("Active roadmap not found for skill: " + skillId));

        mockMvc.perform(get("/api/roadmaps/skills/{skillId}", skillId)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Active roadmap not found for skill: " + skillId))
                .andExpect(jsonPath("$.path").value("/api/roadmaps/skills/" + skillId));
    }

    @Test
    @DisplayName("GET /api/roadmaps/nodes/{nodeId} - Success returns 200 and node details")
    void getNode_Success() throws Exception {
        UUID nodeId = UUID.randomUUID();
        UUID parentId = UUID.randomUUID();

        List<Object> prereqs = List.of(parentId.toString());
        List<Object> resources = List.of(Map.of("title", "Spring Boot Docs", "url", "https://spring.io"));

        RoadmapNodeResponseDTO nodeDTO = new RoadmapNodeResponseDTO(
                nodeId, parentId, "Dependency Injection",
                "IoC container and autowiring", "dependency-injection",
                3, prereqs, resources
        );

        when(roadmapService.getNode(eq(nodeId))).thenReturn(nodeDTO);

        mockMvc.perform(get("/api/roadmaps/nodes/{nodeId}", nodeId)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(nodeId.toString()))
                .andExpect(jsonPath("$.parentNodeId").value(parentId.toString()))
                .andExpect(jsonPath("$.title").value("Dependency Injection"))
                .andExpect(jsonPath("$.description").value("IoC container and autowiring"))
                .andExpect(jsonPath("$.slug").value("dependency-injection"))
                .andExpect(jsonPath("$.sequenceOrder").value(3))
                .andExpect(jsonPath("$.prerequisites[0]").value(parentId.toString()))
                .andExpect(jsonPath("$.resources[0].title").value("Spring Boot Docs"));
    }

    @Test
    @DisplayName("GET /api/roadmaps/nodes/{nodeId} - When node not found returns 404")
    void getNode_NotFound() throws Exception {
        UUID nodeId = UUID.randomUUID();

        when(roadmapService.getNode(eq(nodeId)))
                .thenThrow(new EntityNotFoundException("Roadmap node not found: " + nodeId));

        mockMvc.perform(get("/api/roadmaps/nodes/{nodeId}", nodeId)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Roadmap node not found: " + nodeId))
                .andExpect(jsonPath("$.path").value("/api/roadmaps/nodes/" + nodeId));
    }
}
