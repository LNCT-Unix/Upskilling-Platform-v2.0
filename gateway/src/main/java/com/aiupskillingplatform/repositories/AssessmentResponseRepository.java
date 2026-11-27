package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.AssessmentResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssessmentResponseRepository extends JpaRepository<AssessmentResponse, UUID> {

    List<AssessmentResponse> findByAttemptIdOrderByQuestionOrderAsc(UUID attemptId);

    Optional<AssessmentResponse> findByAttemptIdAndQuestionId(UUID attemptId, UUID questionId);

    long countByAttemptIdAndIsCorrectTrue(UUID attemptId);

    long countByAttemptIdAndIsCorrectFalse(UUID attemptId);
}
