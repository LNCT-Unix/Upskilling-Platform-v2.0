package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.SkillRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SkillRoadmapRepository extends JpaRepository<SkillRoadmap, UUID> {

    Optional<SkillRoadmap> findBySkillIdAndActiveTrue(UUID skillId);

    List<SkillRoadmap> findBySkillId(UUID skillId);

    List<SkillRoadmap> findBySkillIdOrderByVersionDesc(UUID skillId);
}

