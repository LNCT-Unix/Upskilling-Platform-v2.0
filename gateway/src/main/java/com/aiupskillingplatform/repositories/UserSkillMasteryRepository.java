package com.aiupskillingplatform.repositories;

import com.aiupskillingplatform.entities.Skill;
import com.aiupskillingplatform.entities.Track;
import com.aiupskillingplatform.entities.User;
import com.aiupskillingplatform.entities.UserSkillMastery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserSkillMasteryRepository extends JpaRepository<UserSkillMastery, UUID> {

    Optional<UserSkillMastery> findByUserIdAndSkillId(UUID userId, UUID skillId);

    Optional<UserSkillMastery> findByUserAndSkill(User user, Skill skill);

    List<UserSkillMastery> findByUserId(UUID userId);

    List<UserSkillMastery> findByUser(User user);

    List<UserSkillMastery> findByUserIdAndSkillTrackId(UUID userId, UUID trackId);

    List<UserSkillMastery> findByUserAndSkillTrack(User user, Track track);

    @Query("SELECT usm FROM UserSkillMastery usm WHERE usm.user.id = :userId AND usm.skill.track.id = :trackId")
    List<UserSkillMastery> findByUserIdAndTrackId(@Param("userId") UUID userId, @Param("trackId") UUID trackId);

    List<UserSkillMastery> findByUserIdOrderByMasteryScoreDesc(UUID userId);

    List<UserSkillMastery> findByUserIdOrderByMasteryScoreAsc(UUID userId);

    List<UserSkillMastery> findByUserOrderByMasteryScoreDesc(User user);

    boolean existsByUserIdAndSkillId(UUID userId, UUID skillId);

    boolean existsByUserAndSkill(User user, Skill skill);

    List<UserSkillMastery> findByUserIdAndSkillIdIn(UUID userId, List<UUID> skillIds);

    @Query("SELECT usm FROM UserSkillMastery usm WHERE usm.user.id = :userId AND usm.skill.id IN :skillIds")
    List<UserSkillMastery> findByUserIdAndSkillIds(@Param("userId") UUID userId, @Param("skillIds") List<UUID> skillIds);
}
