package com.aiupskillingplatform.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "topics")
@Getter
@Setter
@NoArgsConstructor
public class RoadmapTopic {

    @Id
    @Column(length = 50)
    private String id; // e.g. "1-0"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "step_id", nullable = false)
    private RoadmapStep step;

    @Column(nullable = false, length = 255)
    private String name;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "points", columnDefinition = "jsonb", nullable = false)
    private List<String> points = new ArrayList<>();

    @Column(name = "\"order\"", nullable = false)
    private Integer order;

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RoadmapResource> resources = new ArrayList<>();
}
