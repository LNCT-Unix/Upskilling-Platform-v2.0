package com.aiupskillingplatform.controllers.dag;

import com.aiupskillingplatform.dto.dag.SkillGraphResponseDTO;
import com.aiupskillingplatform.services.dag.SkillGraphService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class SkillGraphController {

    private final SkillGraphService skillGraphService;

    @GetMapping({"/api/tracks/{trackId}/graph", "/api/progress/tracks/{trackId}/graph"})
    public ResponseEntity<SkillGraphResponseDTO> getSkillGraph(@PathVariable UUID trackId) {
        return ResponseEntity.ok(skillGraphService.getSkillGraph(trackId));
    }
}
