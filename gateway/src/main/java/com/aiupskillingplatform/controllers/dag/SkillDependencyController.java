package com.aiupskillingplatform.controllers.dag;

import com.aiupskillingplatform.dto.dag.SkillDependencyRequestDTO;
import com.aiupskillingplatform.dto.dag.SkillDependencyResponseDTO;
import com.aiupskillingplatform.dto.dag.SkillResponseDTO;
import com.aiupskillingplatform.services.dag.SkillDependencyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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

    @PostMapping
    public ResponseEntity<SkillDependencyResponseDTO> addDependency(
            @Valid @RequestBody SkillDependencyRequestDTO request,
            Authentication authentication) {

        assertAdminRole(authentication);
        SkillDependencyResponseDTO response = skillDependencyService.addDependency(
                request.prerequisiteSkillId(),
                request.dependentSkillId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{dependencyId}")
    public ResponseEntity<Void> removeDependency(
            @PathVariable UUID dependencyId,
            Authentication authentication) {

        assertAdminRole(authentication);
        skillDependencyService.removeDependency(dependencyId);
        return ResponseEntity.noContent().build();
    }

    private void assertAdminRole(Authentication authentication) {
        if (authentication == null || authentication.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin role required");
        }
    }
}
