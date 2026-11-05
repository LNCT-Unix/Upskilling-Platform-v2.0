package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.Skill;
import com.aiupskillingplatform.entities.SkillDependency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SkillDependencyRepository extends JpaRepository<SkillDependency, UUID> {

    List<SkillDependency> findByDependentSkillId(UUID dependentSkillId);

    List<SkillDependency> findByDependentSkill(Skill dependentSkill);

    @Query("SELECT sd.prerequisiteSkill FROM SkillDependency sd WHERE sd.dependentSkill.id = :skillId")
    List<Skill> findPrerequisitesBySkillId(@Param("skillId") UUID skillId);

    List<SkillDependency> findByPrerequisiteSkillId(UUID prerequisiteSkillId);

    List<SkillDependency> findByPrerequisiteSkill(Skill prerequisiteSkill);

    @Query("SELECT sd.dependentSkill FROM SkillDependency sd WHERE sd.prerequisiteSkill.id = :skillId")
    List<Skill> findDependentsBySkillId(@Param("skillId") UUID skillId);

    @Query("SELECT sd FROM SkillDependency sd WHERE sd.prerequisiteSkill.track.id = :trackId AND sd.dependentSkill.track.id = :trackId")
    List<SkillDependency> findByTrackId(@Param("trackId") UUID trackId);

    List<SkillDependency> findByDependentSkillTrackId(UUID trackId);

    boolean existsByPrerequisiteSkillIdAndDependentSkillId(UUID prerequisiteSkillId, UUID dependentSkillId);

    boolean existsByPrerequisiteSkillAndDependentSkill(Skill prerequisiteSkill, Skill dependentSkill);

    Optional<SkillDependency> findByPrerequisiteSkillIdAndDependentSkillId(UUID prerequisiteSkillId, UUID dependentSkillId);

    void deleteByPrerequisiteSkillIdAndDependentSkillId(UUID prerequisiteSkillId, UUID dependentSkillId);

    @Override
    List<SkillDependency> findAll();
}
