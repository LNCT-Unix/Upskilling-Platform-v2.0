package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.RoadmapUserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoadmapUserProgressRepository extends JpaRepository<RoadmapUserProgress, UUID> {

    Optional<RoadmapUserProgress> findByUserIdAndTopicKey(UUID userId, String topicKey);

    @Query("SELECT p.topicKey FROM RoadmapUserProgress p WHERE p.user.id = :userId ORDER BY p.topicKey ASC")
    List<String> findCompletedTopicKeysByUserId(@Param("userId") UUID userId);

    @Modifying
    @Query("DELETE FROM RoadmapUserProgress p WHERE p.user.id = :userId AND p.topicKey = :topicKey")
    void deleteByUserIdAndTopicKey(@Param("userId") UUID userId, @Param("topicKey") String topicKey);
}
