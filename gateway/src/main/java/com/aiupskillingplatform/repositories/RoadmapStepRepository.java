package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.RoadmapStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapStepRepository extends JpaRepository<RoadmapStep, Integer> {

    List<RoadmapStep> findByCategoryIdOrderByOrderAsc(Integer categoryId);

    List<RoadmapStep> findAllByOrderByIdAsc();
}
