package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.Skill;
import com.aiupskillingplatform.entities.SkillCategory;
import com.aiupskillingplatform.entities.Track;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SkillRepository extends JpaRepository<Skill, UUID> {

    Optional<Skill> findBySlug(String slug);

    Optional<Skill> findBySlugAndActiveTrue(String slug);

    Optional<Skill> findByIdAndActiveTrue(UUID id);

    boolean existsBySlug(String slug);

    List<Skill> findByActiveTrueOrderBySortOrderAsc();

    List<Skill> findByTrackIdAndActiveTrue(UUID trackId);

    List<Skill> findByTrackIdAndActiveTrueOrderBySortOrderAsc(UUID trackId);

    List<Skill> findByTrackAndActiveTrue(Track track);

    List<Skill> findByCategoryIdAndActiveTrue(UUID categoryId);

    List<Skill> findByCategoryIdAndActiveTrueOrderBySortOrderAsc(UUID categoryId);

    List<Skill> findByCategoryAndActiveTrue(SkillCategory category);

    List<Skill> findByTrackIdAndCategoryIdAndActiveTrue(UUID trackId, UUID categoryId);

    List<Skill> findByTrackIdAndCategoryIdAndActiveTrueOrderBySortOrderAsc(UUID trackId, UUID categoryId);

    List<Skill> findByTrackAndCategoryAndActiveTrue(Track track, SkillCategory category);
}
