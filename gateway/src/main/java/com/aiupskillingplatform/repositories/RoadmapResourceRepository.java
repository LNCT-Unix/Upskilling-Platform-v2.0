package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.RoadmapResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoadmapResourceRepository extends JpaRepository<RoadmapResource, UUID> {

    List<RoadmapResource> findByTopicId(String topicId);

    List<RoadmapResource> findByTopicIdAndTypeIgnoreCase(String topicId, String type);
}
