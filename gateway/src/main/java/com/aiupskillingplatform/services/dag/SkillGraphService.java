
package com.aiupskillingplatform.services.dag;

import com.aiupskillingplatform.dto.dag.SkillGraphEdgeDTO;
import com.aiupskillingplatform.dto.dag.SkillGraphNodeDTO;
import com.aiupskillingplatform.dto.dag.SkillGraphResponseDTO;
import com.aiupskillingplatform.entities.*;
import com.aiupskillingplatform.repositories.*;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SkillGraphService {

    private final SkillRepository skillRepository;
    private final SkillDependencyRepository dependencyRepository;
    private final TrackRepository trackRepository;
    private final UserRepository userRepository;
    private final UserSkillMasteryRepository masteryRepository;

    // Static graph for public endpoint
    public SkillGraphResponseDTO getSkillGraph(UUID trackId) {

        validateTrack(trackId);

        List<Skill> skills = getTopologicalOrder(trackId);

        List<SkillGraphNodeDTO> nodes = new ArrayList<>();

        for (Skill skill : skills) {

            String categoryName =
                    skill.getCategory() != null
                    ? skill.getCategory().getName()
                    : null;

            nodes.add(new SkillGraphNodeDTO(
                    skill.getId(),
                    skill.getName(),
                    skill.getSlug(),
                    skill.getDifficultyLevel(),
                    skill.getSortOrder(),
                    categoryName,
                    null,
                    null
            ));
        }

        return new SkillGraphResponseDTO(
                trackId,
                nodes,
                getEdges(trackId)
        );
    }

    // Personalized graph for authenticated user
    public SkillGraphResponseDTO getPersonalizedSkillGraph(
            UUID trackId,
            Authentication authentication
    ) {

        validateTrack(trackId);

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required"
            );
        }

        // Resolve currently logged-in user
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "User not found"
                        )
                );

        // Fetch skills in topological order
        List<Skill> skills = getTopologicalOrder(trackId);

        // Fetch all mastery records for this user and track
        List<UserSkillMastery> masteryRecords =
                masteryRepository.findByUserIdAndTrackId(
                        user.getId(),
                        trackId
                );

        // Create lookup map for fast matching
        Map<UUID, UserSkillMastery> masteryMap = new HashMap<>();

        for (UserSkillMastery mastery : masteryRecords) {
            masteryMap.put(
                    mastery.getSkill().getId(),
                    mastery
            );
        }

        List<SkillGraphNodeDTO> nodes = new ArrayList<>();

        for (Skill skill : skills) {

            String categoryName =
                    skill.getCategory() != null
                    ? skill.getCategory().getName()
                    : null;

            UserSkillMastery mastery =
                    masteryMap.get(skill.getId());

            String status = mastery != null
                    && mastery.getStatus() != null
                    ? mastery.getStatus()
                    : "LOCKED";

            Double masteryScore = mastery != null
                    ? mastery.getMasteryScore()
                    : 0.0;

            nodes.add(new SkillGraphNodeDTO(
                    skill.getId(),
                    skill.getName(),
                    skill.getSlug(),
                    skill.getDifficultyLevel(),
                    skill.getSortOrder(),
                    categoryName,
                    status,
                    masteryScore
            ));
        }

        return new SkillGraphResponseDTO(
                trackId,
                nodes,
                getEdges(trackId)
        );
    }

    // Fetch active dependency edges
    private List<SkillGraphEdgeDTO> getEdges(UUID trackId) {

        List<SkillDependency> dependencies =
                dependencyRepository.findByTrackId(trackId);

        List<SkillGraphEdgeDTO> edges = new ArrayList<>();

        for (SkillDependency dependency : dependencies) {

            if (dependency.getPrerequisiteSkill().isActive()
                    && dependency.getDependentSkill().isActive()) {

                edges.add(new SkillGraphEdgeDTO(
                        dependency.getPrerequisiteSkill().getId(),
                        dependency.getDependentSkill().getId()
                ));
            }
        }

        return edges;
    }

    // Topological sorting using Kahn's algorithm
    public List<Skill> getTopologicalOrder(UUID trackId) {

        validateTrack(trackId);

        List<Skill> skills =
                skillRepository.findByTrackIdAndActiveTrueOrderBySortOrderAsc(
                        trackId
                );

        if (skills.isEmpty()) {
            return Collections.emptyList();
        }

        List<SkillDependency> dependencies =
                dependencyRepository.findByTrackId(trackId);

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

            UUID prereqId =
                    dependency.getPrerequisiteSkill().getId();

            UUID dependentId =
                    dependency.getDependentSkill().getId();

            if (skillMap.containsKey(prereqId)
                    && skillMap.containsKey(dependentId)) {

                adjacencyList.get(prereqId).add(dependentId);

                inDegree.put(
                        dependentId,
                        inDegree.get(dependentId) + 1
                );
            }
        }

        PriorityQueue<Skill> queue = new PriorityQueue<>(
                Comparator.comparing(
                        Skill::getSortOrder,
                        Comparator.nullsLast(Integer::compareTo)
                ).thenComparing(Skill::getName)
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

            for (UUID dependentId :
                    adjacencyList.get(current.getId())) {

                int updatedDegree =
                        inDegree.get(dependentId) - 1;

                inDegree.put(dependentId, updatedDegree);

                if (updatedDegree == 0) {
                    queue.add(skillMap.get(dependentId));
                }
            }
        }

        if (ordered.size() != skills.size()) {
            throw new IllegalStateException(
                    "Cycle detected in track graph"
            );
        }

        return ordered;
    }

    // Existing path-checking functionality
    public boolean hasPath(
            UUID trackId,
            UUID startSkillId,
            UUID targetSkillId
    ) {

        List<SkillDependency> dependencies =
                dependencyRepository.findByTrackId(trackId);

        Map<UUID, List<UUID>> adjacencyList = new HashMap<>();

        for (SkillDependency dependency : dependencies) {

            UUID prereqId =
                    dependency.getPrerequisiteSkill().getId();

            UUID dependentId =
                    dependency.getDependentSkill().getId();

            adjacencyList.computeIfAbsent(
                    prereqId,
                    k -> new ArrayList<>()
            ).add(dependentId);
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
            throw new EntityNotFoundException(
                    "Track not found: " + trackId
            );
        }

        trackRepository.findByIdAndActiveTrue(trackId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Track is inactive: " + trackId
                        )
                );
    }
}
