package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.RoadmapNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoadmapNodeRepository extends JpaRepository<RoadmapNode, UUID> {

    List<RoadmapNode> findByRoadmapIdOrderBySequenceOrderAsc(UUID roadmapId);

    List<RoadmapNode> findByParentNodeIdOrderBySequenceOrderAsc(UUID parentNodeId);
}

