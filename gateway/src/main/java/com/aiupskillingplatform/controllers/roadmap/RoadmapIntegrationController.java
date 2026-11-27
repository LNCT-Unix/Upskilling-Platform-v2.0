package com.aiupskillingplatform.controllers.roadmap;

import com.aiupskillingplatform.dto.roadmap.personalized.UpdateRoadmapProgressRequestDTO;
import com.aiupskillingplatform.dto.roadmap.personalized.UserGenerateRoadmapRequestDTO;
import com.aiupskillingplatform.entities.User;
import com.aiupskillingplatform.repositories.UserRepository;
import com.aiupskillingplatform.services.roadmap.RoadmapIntegrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@RestController
@RequestMapping("/api/roadmaps")
@RequiredArgsConstructor
public class RoadmapIntegrationController {

    private final RoadmapIntegrationService roadmapIntegrationService;
    private final UserRepository userRepository;


    @PostMapping(value = "/generate", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> generateRoadmap(
            @RequestBody(required = false) UserGenerateRoadmapRequestDTO request,
            Authentication authentication
    ) {
        User user = getAuthenticatedUser(authentication);
        return roadmapIntegrationService.generateRoadmap(user, request);
    }

    @GetMapping(value = "/me", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getActiveRoadmap(
            @RequestParam(required = false) String trackId,
            Authentication authentication
    ) {
        User user = getAuthenticatedUser(authentication);
        return roadmapIntegrationService.getActiveRoadmap(user.getId(), trackId);
    }

    @GetMapping(value = "/me/history", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getRoadmapHistory(
            @RequestParam(required = false) String trackId,
            Authentication authentication
    ) {
        User user = getAuthenticatedUser(authentication);
        return roadmapIntegrationService.getRoadmapHistory(user.getId(), trackId);
    }


    @PatchMapping(value = "/{roadmapId}/progress", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateProgress(
            @PathVariable String roadmapId,
            @Valid @RequestBody UpdateRoadmapProgressRequestDTO request,
            Authentication authentication
    ) {
        User user = getAuthenticatedUser(authentication);
        return roadmapIntegrationService.updateProgress(roadmapId, user.getId(), request);
    }

    private User getAuthenticatedUser(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }
}
