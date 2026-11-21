package com.aiupskillingplatform.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "steps")
@Getter
@Setter
@NoArgsConstructor
public class RoadmapStep {

    @Id
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private RoadmapCategory category;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "\"order\"", nullable = false)
    private Integer order;

    @OneToMany(mappedBy = "step", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("order ASC")
    private List<RoadmapTopic> topics = new ArrayList<>();
}
