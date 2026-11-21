package com.aiupskillingplatform.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
public class RoadmapCategory {

    @Id
    private Integer id;

    @Column(nullable = false, length = 255)
    private String title;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("order ASC")
    private List<RoadmapStep> steps = new ArrayList<>();
}
