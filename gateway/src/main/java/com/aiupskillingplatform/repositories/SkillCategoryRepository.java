package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SkillCategoryRepository extends JpaRepository<SkillCategory, UUID> {

    Optional<SkillCategory> findBySlug(String slug);

    Optional<SkillCategory> findBySlugAndActiveTrue(String slug);

    List<SkillCategory> findByActiveTrueOrderBySortOrderAsc();

    Optional<SkillCategory> findByIdAndActiveTrue(UUID id);

    boolean existsBySlug(String slug);
}
