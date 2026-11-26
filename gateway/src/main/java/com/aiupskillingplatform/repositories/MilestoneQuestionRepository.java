package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.MilestoneQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MilestoneQuestionRepository extends JpaRepository<MilestoneQuestion, UUID> {

    List<MilestoneQuestion> findBySkillIdAndIsActiveTrue(UUID skillId);

    long countBySkillIdAndIsActiveTrue(UUID skillId);

    List<MilestoneQuestion> findByNodeIdAndIsActiveTrue(UUID nodeId);

    List<MilestoneQuestion> findByNodeIdInAndIsActiveTrue(List<UUID> nodeIds);
}
