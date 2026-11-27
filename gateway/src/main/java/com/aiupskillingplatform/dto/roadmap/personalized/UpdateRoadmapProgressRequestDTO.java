package com.aiupskillingplatform.dto.roadmap.personalized;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRoadmapProgressRequestDTO {
    @NotBlank(message = "stepId is required")
    private String stepId;

    private String topicId;

    @NotBlank(message = "status is required")
    private String status; // NOT_STARTED, IN_PROGRESS, COMPLETED
}
