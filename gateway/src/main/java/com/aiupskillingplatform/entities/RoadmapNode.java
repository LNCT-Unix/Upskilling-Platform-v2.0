package com.aiupskillingplatform.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "roadmap_nodes")
@Getter
@Setter
@NoArgsConstructor
public class RoadmapNode {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roadmap_id", nullable = false)
    private SkillRoadmap roadmap;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_node_id")
    private RoadmapNode parentNode;

    @OneToMany(mappedBy = "parentNode", cascade = CascadeType.ALL)
    @OrderBy("sequenceOrder ASC")
    private List<RoadmapNode> childNodes = new ArrayList<>();

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 200)
    private String slug;

    @Column(name = "sequence_order", nullable = false)
    private Integer sequenceOrder = 1;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "prerequisites", columnDefinition = "jsonb", nullable = false)
    private String prerequisites = "[]";

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "resources", columnDefinition = "jsonb", nullable = false)
    private String resources = "[]";

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();
}

