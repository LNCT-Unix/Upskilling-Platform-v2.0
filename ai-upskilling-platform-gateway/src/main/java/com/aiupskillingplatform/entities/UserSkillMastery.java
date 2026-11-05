
package com.aiupskillingplatform.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "user_skill_mastery",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_skill_mastery",
                        columnNames = {"user_id", "skill_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class UserSkillMastery {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(name = "status")
    private String status;

    @Column(name = "mastery_score", nullable = false)
    private Double masteryScore = 0.0;

    @Column(name = "confidence_score", nullable = false)
    private Double confidenceScore = 0.0;

    @Column(name = "evidence_count", nullable = false)
    private Integer evidenceCount = 0;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();
}
