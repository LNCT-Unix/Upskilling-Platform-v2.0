package com.aiupskillingplatform.controllers.dag;



import com.aiupskillingplatform.dto.dag.SkillResponseDTO;
import com.aiupskillingplatform.services.dag.SkillDependencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/dependencies")
@RequiredArgsConstructor
public class SkillDependencyController {

    private final SkillDependencyService skillDependencyService;

    @GetMapping("/skills/{skillId}/prerequisites")
    public ResponseEntity<List<SkillResponseDTO>> getPrerequisites(@PathVariable UUID skillId) {
        return ResponseEntity.ok(skillDependencyService.getPrerequisites(skillId));
    }


}
