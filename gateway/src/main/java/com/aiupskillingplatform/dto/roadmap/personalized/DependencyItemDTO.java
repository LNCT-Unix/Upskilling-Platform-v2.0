package com.aiupskillingplatform.dto.roadmap.personalized;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DependencyItemDTO {
    private String prerequisite;
    private String dependent;
}
