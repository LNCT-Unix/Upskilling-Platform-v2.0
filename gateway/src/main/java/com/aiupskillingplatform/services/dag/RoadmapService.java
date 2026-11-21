package com.aiupskillingplatform.services.dag;

import com.aiupskillingplatform.dto.dag.RoadmapNodeResponseDTO;
import com.aiupskillingplatform.dto.dag.RoadmapResponseDTO;
import com.aiupskillingplatform.entities.RoadmapNode;
import com.aiupskillingplatform.entities.Skill;
import com.aiupskillingplatform.entities.SkillRoadmap;
import com.aiupskillingplatform.repositories.RoadmapNodeRepository;
import com.aiupskillingplatform.repositories.SkillRepository;
import com.aiupskillingplatform.repositories.SkillRoadmapRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoadmapService {

    private final SkillRepository skillRepository;
    private final SkillRoadmapRepository roadmapRepository;
    private final RoadmapNodeRepository nodeRepository;
    private final ObjectMapper objectMapper;

    public RoadmapResponseDTO getRoadmapBySkill(UUID skillId) {
        Skill skill = skillRepository.findByIdAndActiveTrue(skillId)
                .orElseThrow(() -> new EntityNotFoundException("Skill not found or inactive: " + skillId));

        SkillRoadmap roadmap = roadmapRepository.findBySkillIdAndActiveTrue(skillId)
                .orElseThrow(() -> new EntityNotFoundException("Active roadmap not found for skill: " + skillId));

        List<RoadmapNode> nodes = nodeRepository.findByRoadmapIdOrderBySequenceOrderAsc(roadmap.getId());

        List<RoadmapNodeResponseDTO> nodeDTOs = new ArrayList<>(nodes.size());
        for (RoadmapNode node : nodes) {
            nodeDTOs.add(toDTO(node));
        }

        return new RoadmapResponseDTO(
                roadmap.getId(),
                skill.getId(),
                skill.getName(),
                skill.getSlug(),
                roadmap.getTitle(),
                roadmap.getDescription(),
                roadmap.getVersion(),
                nodeDTOs
        );
    }

    public RoadmapNodeResponseDTO getNode(UUID nodeId) {
        RoadmapNode node = nodeRepository.findById(nodeId)
                .orElseThrow(() -> new EntityNotFoundException("Roadmap node not found: " + nodeId));
        return toDTO(node);
    }

    private RoadmapNodeResponseDTO toDTO(RoadmapNode node) {
        UUID parentNodeId = node.getParentNode() != null ? node.getParentNode().getId() : null;

        return new RoadmapNodeResponseDTO(
                node.getId(),
                parentNodeId,
                node.getTitle(),
                node.getDescription(),
                node.getSlug(),
                node.getSequenceOrder(),
                parseJson(node.getPrerequisites()),
                parseJson(node.getResources())
        );
    }

    private Object parseJson(String value) {
        if (value == null || value.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(value, Object.class);
        } catch (Exception ex) {
            return Collections.emptyList();
        }
    }
}
