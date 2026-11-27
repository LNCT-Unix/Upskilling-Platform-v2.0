package com.aiupskillingplatform.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "assessment_attempts")
@Getter
@Setter
@NoArgsConstructor
public class AssessmentAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

    @Column(name = "status", nullable = false, length = 20)
    private String status; // IN_PROGRESS, COMPLETED, ABANDONED

    // NOTE: difficulty, correct_count, wrong_count, score columns are NOT in V1 schema.
    // Your teammate must add them via a Flyway migration before these fields can be used.

    @Column(name = "total_questions")
    private Integer totalQuestions = 0;

    @Column(name = "answered_questions")
    private Integer answeredQuestions = 0;

    @Column(name = "started_at")
    private Instant startedAt = Instant.now();

    @Column(name = "completed_at")
    private Instant completedAt;

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AssessmentResponse> responses = new ArrayList<>();
}
