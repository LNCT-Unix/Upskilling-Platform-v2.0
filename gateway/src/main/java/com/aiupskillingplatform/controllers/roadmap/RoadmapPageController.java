package com.aiupskillingplatform.controllers.roadmap;

import com.aiupskillingplatform.dto.roadmap.*;
import com.aiupskillingplatform.entities.User;
import com.aiupskillingplatform.repositories.UserRepository;
import com.aiupskillingplatform.services.roadmap.RoadmapPageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/roadmap")
@RequiredArgsConstructor
public class RoadmapPageController {

    private final RoadmapPageService roadmapPageService;
    private final UserRepository userRepository;

    // 1. Get roadmap structure
    @GetMapping
    public ResponseEntity<RoadmapStructureResponseDTO> getRoadmapStructure() {
        return ResponseEntity.ok(roadmapPageService.getRoadmapStructure());
    }

    // 2. Get user's completed topics
    @GetMapping("/progress")
    public ResponseEntity<UserProgressResponseDTO> getUserProgress(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return ResponseEntity.ok(roadmapPageService.getUserProgress(user.getId()));
    }

    // 3. Mark topic done / not done
    @PutMapping("/progress/{topicKey}")
    public ResponseEntity<UserProgressResponseDTO> updateProgress(
            @PathVariable String topicKey,
            @Valid @RequestBody UpdateProgressRequestDTO request,
            Authentication authentication) {
        User user = getCurrentUser(authentication);
        return ResponseEntity.ok(roadmapPageService.updateProgress(user.getId(), topicKey, request.done()));
    }

    // 4. Get resources for a topic
    @GetMapping("/topics/{topicKey}/resources")
    public ResponseEntity<List<TopicResourceResponseDTO>> getTopicResources(
            @PathVariable String topicKey,
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(roadmapPageService.getTopicResources(topicKey, type));
    }

    private User getCurrentUser(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }
}
