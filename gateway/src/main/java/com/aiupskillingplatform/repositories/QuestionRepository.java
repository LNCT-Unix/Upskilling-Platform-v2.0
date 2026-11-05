package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.Question;
import com.aiupskillingplatform.entities.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {

    Optional<Question> findByIdAndActiveTrue(UUID id);

    @Query("SELECT q FROM Question q JOIN q.skills s WHERE s.id = :skillId AND UPPER(q.difficulty) = UPPER(:difficulty) AND q.active = true")
    List<Question> findBySkillIdAndDifficulty(@Param("skillId") UUID skillId, @Param("difficulty") String difficulty);

    @Query("SELECT q FROM Question q JOIN q.skills s WHERE s.id = :skillId AND q.active = true")
    List<Question> findBySkillId(@Param("skillId") UUID skillId);

    @Query("SELECT s FROM Question q JOIN q.skills s WHERE q.id = :questionId")
    List<Skill> findSkillsByQuestionId(@Param("questionId") UUID questionId);
}

