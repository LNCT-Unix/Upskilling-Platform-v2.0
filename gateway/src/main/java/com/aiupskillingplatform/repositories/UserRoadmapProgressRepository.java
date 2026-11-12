package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.UserRoadmapProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRoadmapProgressRepository extends JpaRepository<UserRoadmapProgress, UUID> {

    Optional<UserRoadmapProgress> findByUserIdAndNodeId(UUID userId, UUID nodeId);

    List<UserRoadmapProgress> findByUserId(UUID userId);
}

