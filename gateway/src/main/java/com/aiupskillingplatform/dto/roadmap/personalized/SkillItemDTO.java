package com.aiupskillingplatform.dto.roadmap.personalized;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillItemDTO {
    private String skillSlug;
    private String name;
    private String status;
    private Double score;
}
