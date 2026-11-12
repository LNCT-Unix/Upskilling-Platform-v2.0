
package com.aiupskillingplatform.controllers.dag;

import com.aiupskillingplatform.dto.dag.SkillGraphResponseDTO;
import com.aiupskillingplatform.services.dag.SkillGraphService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class SkillGraphController {

    private final SkillGraphService skillGraphService;

    // Static graph: available without authentication
    @GetMapping("/api/tracks/{trackId}/graph")
    public ResponseEntity<SkillGraphResponseDTO> getStaticGraph(
            @PathVariable UUID trackId
    ) {
        return ResponseEntity.ok(
                skillGraphService.getSkillGraph(trackId)
        );
    }

    // Personalized graph: requires authenticated user
    @GetMapping("/api/progress/tracks/{trackId}/graph")
    public ResponseEntity<SkillGraphResponseDTO> getProgressGraph(
            @PathVariable UUID trackId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                skillGraphService.getPersonalizedSkillGraph(
                        trackId,
                        authentication
                )
        );
    }
}
