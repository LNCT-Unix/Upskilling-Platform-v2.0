package com.aiupskillingplatform.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "user_progress",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_progress_user_topic",
                        columnNames = {"user_id", "topic_key"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class RoadmapUserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "topic_key", nullable = false, length = 50)
    private String topicKey;

    @Column(name = "completed_at", nullable = false)
    private Instant completedAt = Instant.now();
}
