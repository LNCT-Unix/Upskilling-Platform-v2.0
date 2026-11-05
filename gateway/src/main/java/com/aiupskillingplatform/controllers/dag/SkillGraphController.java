package com.aiupskillingplatform.controllers.dag;

import com.aiupskillingplatform.dto.dag.SkillGraphResponseDTO;
import com.aiupskillingplatform.services.dag.SkillGraphService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/tracks")
@RequiredArgsConstructor
public class SkillGraphController {

    private final SkillGraphService skillGraphService;

    @GetMapping("/{trackId}/graph")
    public ResponseEntity<SkillGraphResponseDTO> getInitialGraph(@PathVariable UUID trackId) {
        return ResponseEntity.ok(skillGraphService.getInitialGraph(trackId));
    }
}
