package com.aiupskillingplatform.services.dag;

import com.aiupskillingplatform.dto.dag.SkillDependencyResponseDTO;
import com.aiupskillingplatform.dto.dag.SkillResponseDTO;
import com.aiupskillingplatform.entities.Skill;
import com.aiupskillingplatform.entities.SkillDependency;
import com.aiupskillingplatform.repositories.SkillDependencyRepository;
import com.aiupskillingplatform.repositories.SkillRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SkillDependencyService {

    private final SkillRepository skillRepository;
    private final SkillDependencyRepository dependencyRepository;
    private final SkillGraphService skillGraphService;

    public SkillDependencyResponseDTO addDependency(UUID prerequisiteSkillId, UUID dependentSkillId) {
        if (prerequisiteSkillId.equals(dependentSkillId)) {
            throw new IllegalArgumentException("A skill cannot depend on itself");
        }

        Skill prerequisite = skillRepository.findByIdAndActiveTrue(prerequisiteSkillId)
                .orElseThrow(() -> new EntityNotFoundException("Prerequisite skill not found or inactive: " + prerequisiteSkillId));

        Skill dependent = skillRepository.findByIdAndActiveTrue(dependentSkillId)
                .orElseThrow(() -> new EntityNotFoundException("Dependent skill not found or inactive: " + dependentSkillId));

        UUID trackId = prerequisite.getTrack().getId();
        if (!trackId.equals(dependent.getTrack().getId())) {
            throw new IllegalArgumentException("Skills must belong to the same track");
        }

        if (dependencyRepository.existsByPrerequisiteSkillIdAndDependentSkillId(prerequisiteSkillId, dependentSkillId)) {
            throw new IllegalStateException("Dependency already exists between these skills");
        }

        if (skillGraphService.hasPath(trackId, dependentSkillId, prerequisiteSkillId)) {
            throw new IllegalArgumentException("Adding this dependency creates a cycle");
        }

        SkillDependency dependency = new SkillDependency();
        dependency.setPrerequisiteSkill(prerequisite);
        dependency.setDependentSkill(dependent);

        SkillDependency saved = dependencyRepository.save(dependency);

        return new SkillDependencyResponseDTO(
                saved.getId(),
                prerequisite.getId(),
                prerequisite.getName(),
                dependent.getId(),
                dependent.getName()
        );
    }

    public void removeDependency(UUID dependencyId) {
        if (!dependencyRepository.existsById(dependencyId)) {
            throw new EntityNotFoundException("Skill dependency not found: " + dependencyId);
        }
        dependencyRepository.deleteById(dependencyId);
    }

    @Transactional(readOnly = true)
    public List<SkillResponseDTO> getPrerequisites(UUID skillId) {
        skillRepository.findByIdAndActiveTrue(skillId)
                .orElseThrow(() -> new EntityNotFoundException("Skill not found or inactive: " + skillId));

        List<Skill> prerequisites = dependencyRepository.findPrerequisitesBySkillId(skillId);
        List<SkillResponseDTO> response = new ArrayList<>();

        for (Skill skill : prerequisites) {
            if (skill.isActive()) {
                response.add(new SkillResponseDTO(
                        skill.getId(),
                        skill.getName(),
                        skill.getSlug(),
                        skill.getDescription(),
                        skill.getDifficultyLevel(),
                        skill.getSortOrder(),
                        skill.isActive()
                ));
            }
        }

        return response;
    }
}
