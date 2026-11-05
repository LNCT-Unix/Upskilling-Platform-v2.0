package com.aiupskillingplatform.services.dag;

import com.aiupskillingplatform.dto.dag.SkillGraphEdgeDTO;
import com.aiupskillingplatform.dto.dag.SkillGraphNodeDTO;
import com.aiupskillingplatform.dto.dag.SkillGraphResponseDTO;
import com.aiupskillingplatform.entities.Skill;
import com.aiupskillingplatform.entities.SkillDependency;
import com.aiupskillingplatform.entities.User;
import com.aiupskillingplatform.entities.UserSkillMastery;
import com.aiupskillingplatform.enums.UserStatus;
import com.aiupskillingplatform.repositories.SkillDependencyRepository;
import com.aiupskillingplatform.repositories.TrackRepository;
import com.aiupskillingplatform.repositories.UserRepository;
import com.aiupskillingplatform.repositories.UserSkillMasteryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserSkillProgressService {

    @Value("${dag.mastery.threshold:0.75}")
    private double defaultThreshold;

    private final UserRepository userRepository;
    private final TrackRepository trackRepository;
    private final SkillGraphService skillGraphService;
    private final SkillDependencyRepository dependencyRepository;
    private final UserSkillMasteryRepository userSkillMasteryRepository;

    public SkillGraphResponseDTO getPersonalizedGraph(UUID userId, UUID trackId, Double customThreshold) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new IllegalStateException("User account is not active");
        }

        trackRepository.findByIdAndActiveTrue(trackId)
                .orElseThrow(() -> new EntityNotFoundException("Track not found or inactive: " + trackId));

        double threshold = (customThreshold != null) ? customThreshold : defaultThreshold;

        List<Skill> skills = skillGraphService.getTopologicalOrder(trackId);
        List<SkillDependency> dependencies = dependencyRepository.findByTrackId(trackId);
        List<UserSkillMastery> masteries = userSkillMasteryRepository.findByUserIdAndSkillTrackId(userId, trackId);

        Map<UUID, Double> masteryMap = new HashMap<>();
        Map<UUID, String> statusMap = new HashMap<>();
        for (UserSkillMastery mastery : masteries) {
            if (mastery.getSkill() != null) {
                if (mastery.getMasteryScore() != null) {
                    masteryMap.put(mastery.getSkill().getId(), mastery.getMasteryScore());
                }
                if (mastery.getStatus() != null && !mastery.getStatus().isBlank()) {
                    statusMap.put(mastery.getSkill().getId(), mastery.getStatus());
                }
            }
        }

        Map<UUID, List<UUID>> prerequisitesMap = new HashMap<>();
        Map<UUID, List<String>> prereqNamesMap = new HashMap<>();

        for (SkillDependency dependency : dependencies) {
            Skill prereq = dependency.getPrerequisiteSkill();
            Skill dep = dependency.getDependentSkill();
            if (prereq.isActive() && dep.isActive()) {
                prerequisitesMap.computeIfAbsent(dep.getId(), k -> new ArrayList<>()).add(prereq.getId());
                prereqNamesMap.computeIfAbsent(dep.getId(), k -> new ArrayList<>()).add(prereq.getName());
            }
        }

        List<SkillGraphNodeDTO> nodes = new ArrayList<>();
        for (Skill skill : skills) {
            UUID skillId = skill.getId();
            Double score = masteryMap.get(skillId);
            List<String> prereqNames = prereqNamesMap.getOrDefault(skillId, Collections.emptyList());

            String status;
            String explicitStatus = statusMap.get(skillId);
            if (explicitStatus != null) {
                status = explicitStatus;
            } else if (score != null && score >= threshold) {
                status = "MASTERED";
            } else {
                List<UUID> prereqIds = prerequisitesMap.get(skillId);
                boolean allPrereqsMastered = true;
                if (prereqIds != null && !prereqIds.isEmpty()) {
                    for (UUID prereqId : prereqIds) {
                        Double prereqScore = masteryMap.get(prereqId);
                        if (prereqScore == null || prereqScore < threshold) {
                            allPrereqsMastered = false;
                            break;
                        }
                    }
                }

                if (allPrereqsMastered) {
                    status = "UNLOCKED";
                } else {
                    status = "LOCKED";
                }
            }

            String categoryName = skill.getCategory() != null ? skill.getCategory().getName() : null;
            nodes.add(new SkillGraphNodeDTO(
                    skill.getId(),
                    skill.getName(),
                    skill.getSlug(),
                    skill.getDifficultyLevel(),
                    skill.getSortOrder(),
                    categoryName,
                    status,
                    score,
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
}
