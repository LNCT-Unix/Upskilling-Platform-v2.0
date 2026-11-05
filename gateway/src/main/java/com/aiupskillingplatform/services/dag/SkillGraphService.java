package com.aiupskillingplatform.services.dag;

import com.aiupskillingplatform.dto.dag.SkillGraphEdgeDTO;
import com.aiupskillingplatform.dto.dag.SkillGraphNodeDTO;
import com.aiupskillingplatform.dto.dag.SkillGraphResponseDTO;
import com.aiupskillingplatform.entities.Skill;
import com.aiupskillingplatform.entities.SkillDependency;
import com.aiupskillingplatform.repositories.SkillDependencyRepository;
import com.aiupskillingplatform.repositories.SkillRepository;
import com.aiupskillingplatform.repositories.TrackRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SkillGraphService {

    private final SkillRepository skillRepository;
    private final SkillDependencyRepository dependencyRepository;
    private final TrackRepository trackRepository;

    public SkillGraphResponseDTO getInitialGraph(UUID trackId) {
        validateTrack(trackId);

        List<Skill> skills = getTopologicalOrder(trackId);
        List<SkillDependency> dependencies = dependencyRepository.findByTrackId(trackId);

        Map<UUID, List<String>> prereqNamesMap = new HashMap<>();
        for (SkillDependency dependency : dependencies) {
            Skill prereq = dependency.getPrerequisiteSkill();
            Skill dep = dependency.getDependentSkill();
            if (prereq.isActive() && dep.isActive()) {
                prereqNamesMap.computeIfAbsent(dep.getId(), k -> new ArrayList<>()).add(prereq.getName());
            }
        }

        List<SkillGraphNodeDTO> nodes = new ArrayList<>();
        for (Skill skill : skills) {
            String categoryName = skill.getCategory() != null ? skill.getCategory().getName() : null;
            List<String> prereqNames = prereqNamesMap.getOrDefault(skill.getId(), Collections.emptyList());

            nodes.add(new SkillGraphNodeDTO(
                    skill.getId(),
                    skill.getName(),
                    skill.getSlug(),
                    skill.getDifficultyLevel(),
                    skill.getSortOrder(),
                    categoryName,
                    null,
                    null,
                    prereqNames
            ));
        }

        List<SkillGraphEdgeDTO> edges = new ArrayList<>();
        for (SkillDependency dependency : dependencies) {
            if (dependency.getPrerequisiteSkill().isActive() && dependency.getDependentSkill().isActive()) {
                edges.add(new SkillGraphEdgeDTO(
                        dependency.getPrerequisiteSkill().getId(),
                        dependency.getDependentSkill().getId()
                ));
            }
        }

        return new SkillGraphResponseDTO(trackId, nodes, edges);
    }

    public List<Skill> getTopologicalOrder(UUID trackId) {
        validateTrack(trackId);

        List<Skill> skills = skillRepository.findByTrackIdAndActiveTrueOrderBySortOrderAsc(trackId);
        if (skills.isEmpty()) {
            return Collections.emptyList();
        }

        List<SkillDependency> dependencies = dependencyRepository.findByTrackId(trackId);

        Map<UUID, Skill> skillMap = new HashMap<>();
        Map<UUID, Integer> inDegree = new HashMap<>();
        Map<UUID, List<UUID>> adjacencyList = new HashMap<>();

        for (Skill skill : skills) {
            UUID id = skill.getId();
            skillMap.put(id, skill);
            inDegree.put(id, 0);
            adjacencyList.put(id, new ArrayList<>());
        }

        for (SkillDependency dependency : dependencies) {
            UUID prereqId = dependency.getPrerequisiteSkill().getId();
            UUID depId = dependency.getDependentSkill().getId();
            if (skillMap.containsKey(prereqId) && skillMap.containsKey(depId)) {
                adjacencyList.get(prereqId).add(depId);
                inDegree.put(depId, inDegree.get(depId) + 1);
            }
        }

        PriorityQueue<Skill> queue = new PriorityQueue<>(
                Comparator.comparing(Skill::getSortOrder, Comparator.nullsLast(Integer::compareTo))
                        .thenComparing(Skill::getName)
        );

        for (Skill skill : skills) {
            if (inDegree.get(skill.getId()) == 0) {
                queue.add(skill);
            }
        }

        List<Skill> ordered = new ArrayList<>();
        while (!queue.isEmpty()) {
            Skill current = queue.poll();
            ordered.add(current);

            List<UUID> dependents = adjacencyList.get(current.getId());
            for (UUID depId : dependents) {
                int updatedDegree = inDegree.get(depId) - 1;
                inDegree.put(depId, updatedDegree);
                if (updatedDegree == 0) {
                    queue.add(skillMap.get(depId));
                }
            }
        }

        if (ordered.size() != skills.size()) {
            throw new IllegalStateException("Cycle detected in track graph");
        }

        return ordered;
    }

    public boolean hasPath(UUID trackId, UUID startSkillId, UUID targetSkillId) {
        List<SkillDependency> dependencies = dependencyRepository.findByTrackId(trackId);

        Map<UUID, List<UUID>> adjacencyList = new HashMap<>();
        for (SkillDependency dependency : dependencies) {
            UUID prereqId = dependency.getPrerequisiteSkill().getId();
            UUID depId = dependency.getDependentSkill().getId();
            adjacencyList.computeIfAbsent(prereqId, k -> new ArrayList<>()).add(depId);
        }

        Queue<UUID> queue = new ArrayDeque<>();
        Set<UUID> visited = new HashSet<>();

        queue.add(startSkillId);
        visited.add(startSkillId);

        while (!queue.isEmpty()) {
            UUID current = queue.poll();
            if (current.equals(targetSkillId)) {
                return true;
            }

            List<UUID> neighbors = adjacencyList.get(current);
            if (neighbors != null) {
                for (UUID neighbor : neighbors) {
                    if (visited.add(neighbor)) {
                        queue.add(neighbor);
                    }
                }
            }
        }

        return false;
    }

    private void validateTrack(UUID trackId) {
        if (!trackRepository.existsById(trackId)) {
            throw new EntityNotFoundException("Track not found: " + trackId);
        }
        trackRepository.findByIdAndActiveTrue(trackId)
                .orElseThrow(() -> new EntityNotFoundException("Track is inactive: " + trackId));
    }
}
