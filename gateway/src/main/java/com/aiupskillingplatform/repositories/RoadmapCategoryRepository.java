package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.RoadmapCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapCategoryRepository extends JpaRepository<RoadmapCategory, Integer> {

    List<RoadmapCategory> findAllByOrderByIdAsc();
}
