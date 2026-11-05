package com.aiupskillingplatform.controllers.dag;

import com.aiupskillingplatform.dto.dag.SkillGraphResponseDTO;
import com.aiupskillingplatform.entities.User;
import com.aiupskillingplatform.repositories.UserRepository;
import com.aiupskillingplatform.services.dag.UserSkillProgressService;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Validated
@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class UserSkillProgressController {

    private final UserSkillProgressService userSkillProgressService;
    private final UserRepository userRepository;

    @GetMapping("/tracks/{trackId}/graph")
    public ResponseEntity<SkillGraphResponseDTO> getPersonalizedGraph(
            @PathVariable UUID trackId,
            @RequestParam(required = false)
            @DecimalMin(value = "0.0", message = "Threshold must be between 0.0 and 1.0")
            @DecimalMax(value = "1.0", message = "Threshold must be between 0.0 and 1.0")
            Double threshold,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(userSkillProgressService.getPersonalizedGraph(user.getId(), trackId, threshold));
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Authenticated user not found"));
    }
}
