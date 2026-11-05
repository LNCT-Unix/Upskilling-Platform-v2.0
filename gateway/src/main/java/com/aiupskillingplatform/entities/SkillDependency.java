
package com.aiupskillingplatform.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(
        name = "skill_dependencies",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_skill_dependency",
                        columnNames = {"prerequisite_skill_id", "dependent_skill_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class SkillDependency {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prerequisite_skill_id", nullable = false)
    private Skill prerequisiteSkill;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dependent_skill_id", nullable = false)
    private Skill dependentSkill;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;
}
