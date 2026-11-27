package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.AssessmentAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssessmentAttemptRepository extends JpaRepository<AssessmentAttempt, UUID> {

    Optional<AssessmentAttempt> findTopByUserIdAndStatusOrderByStartedAtDesc(UUID userId, String status);

    Optional<AssessmentAttempt> findTopByUserIdAndTrackSlugAndStatusOrderByStartedAtDesc(UUID userId, String trackSlug, String status);

    Optional<AssessmentAttempt> findTopByUserIdAndTrackIdOrderByStartedAtDesc(UUID userId, UUID trackId);

    Optional<AssessmentAttempt> findTopByUserIdAndTrackSlugOrderByStartedAtDesc(UUID userId, String trackSlug);

    Optional<AssessmentAttempt> findTopByUserIdOrderByStartedAtDesc(UUID userId);

    List<AssessmentAttempt> findByUserIdOrderByStartedAtDesc(UUID userId);

    Optional<AssessmentAttempt> findByIdAndUserId(UUID id, UUID userId);
}
