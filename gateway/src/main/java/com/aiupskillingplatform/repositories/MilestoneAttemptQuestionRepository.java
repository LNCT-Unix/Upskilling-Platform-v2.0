package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.MilestoneAttemptQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MilestoneAttemptQuestionRepository extends JpaRepository<MilestoneAttemptQuestion, UUID> {

    @Query("SELECT DISTINCT maq.question.id FROM MilestoneAttemptQuestion maq WHERE maq.attempt.user.id = :userId AND maq.attempt.skill.id = :skillId")
    List<UUID> findUsedQuestionIdsByUserAndSkill(@Param("userId") UUID userId, @Param("skillId") UUID skillId);

    List<MilestoneAttemptQuestion> findByAttemptIdOrderByQuestionOrderAsc(UUID attemptId);

    Optional<MilestoneAttemptQuestion> findByAttemptIdAndQuestionId(UUID attemptId, UUID questionId);
}
