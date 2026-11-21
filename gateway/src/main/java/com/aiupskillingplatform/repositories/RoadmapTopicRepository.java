package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.RoadmapTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapTopicRepository extends JpaRepository<RoadmapTopic, String> {

    List<RoadmapTopic> findByStepIdOrderByOrderAsc(Integer stepId);

    List<RoadmapTopic> findAllByOrderByOrderAsc();

    boolean existsById(String id);
}
