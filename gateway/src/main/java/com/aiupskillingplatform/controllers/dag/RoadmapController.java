package com.aiupskillingplatform.controllers.dag;

import com.aiupskillingplatform.dto.dag.RoadmapNodeResponseDTO;
import com.aiupskillingplatform.dto.dag.RoadmapResponseDTO;
import com.aiupskillingplatform.services.dag.RoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/roadmaps")
@RequiredArgsConstructor
public class RoadmapController {

    private final RoadmapService roadmapService;

    @GetMapping("/skills/{skillId}")
    public ResponseEntity<RoadmapResponseDTO> getRoadmapBySkill(@PathVariable UUID skillId) {
        return ResponseEntity.ok(roadmapService.getRoadmapBySkill(skillId));
    }

    @GetMapping("/nodes/{nodeId}")
    public ResponseEntity<RoadmapNodeResponseDTO> getNode(@PathVariable UUID nodeId) {
        return ResponseEntity.ok(roadmapService.getNode(nodeId));
    }
}
