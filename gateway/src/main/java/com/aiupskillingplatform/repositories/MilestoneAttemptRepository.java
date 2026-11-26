package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.MilestoneAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MilestoneAttemptRepository extends JpaRepository<MilestoneAttempt, UUID> {

    Optional<MilestoneAttempt> findByUserIdAndSkillIdAndStatus(UUID userId, UUID skillId, String status);

    @Query("SELECT MAX(a.attemptNumber) FROM MilestoneAttempt a WHERE a.user.id = :userId AND a.skill.id = :skillId")
    Optional<Integer> findMaxAttemptNumberByUserIdAndSkillId(@Param("userId") UUID userId, @Param("skillId") UUID skillId);

    List<MilestoneAttempt> findByUserIdAndSkillIdOrderByStartedAtDesc(UUID userId, UUID skillId);
}
