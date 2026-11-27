package com.aiupskillingplatform.services.roadmap;

import com.aiupskillingplatform.dto.roadmap.personalized.GenerateRoadmapPayloadDTO;
import com.aiupskillingplatform.dto.roadmap.personalized.UpdateRoadmapProgressRequestDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class NodeRoadmapClient {
    private final RestClient restClient;
    private final String internalSecret;
    public NodeRoadmapClient(
            @Value("${roadmap.service.base-url:http://localhost:3000}") String baseUrl,
            @Value("${roadmap.service.internal-secret:octobyte_internal_secret_2026}") String internalSecret
    ) {
        this.internalSecret = internalSecret;

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(10));
        requestFactory.setReadTimeout(Duration.ofSeconds(90));

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(requestFactory)
                .defaultHeader("x-internal-secret", internalSecret)
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .build();

        log.info("Initialized NodeRoadmapClient pointing to {}", baseUrl);
    }


    public ResponseEntity<String> generateRoadmap(GenerateRoadmapPayloadDTO payload) {
        try {
            return restClient.post()
                    .uri("/api/roadmaps/generate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toEntity(String.class);
        } catch (RestClientResponseException ex) {
            log.error("Node.js generateRoadmap error: status={}, body={}", ex.getStatusCode(), ex.getResponseBodyAsString());
            return ResponseEntity.status(ex.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ex.getResponseBodyAsString());
        }
    }
    public ResponseEntity<String> getActiveRoadmap(String userId, String trackId) {
        try {
            return restClient.get()
                    .uri(uriBuilder -> {
                        uriBuilder.path("/api/roadmaps/me")
                                .queryParam("userId", userId);
                        if (trackId != null && !trackId.isBlank()) {
                            uriBuilder.queryParam("trackId", trackId.trim());
                        }
                        return uriBuilder.build();
                    })
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .toEntity(String.class);
        } catch (RestClientResponseException ex) {
            log.error("Node.js getActiveRoadmap error: status={}, body={}", ex.getStatusCode(), ex.getResponseBodyAsString());
            return ResponseEntity.status(ex.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ex.getResponseBodyAsString());
        }
    }
    public ResponseEntity<String> getRoadmapHistory(String userId, String trackId) {
        try {
            return restClient.get()
                    .uri(uriBuilder -> {
                        uriBuilder.path("/api/roadmaps/me/history")
                                .queryParam("userId", userId);
                        if (trackId != null && !trackId.isBlank()) {
                            uriBuilder.queryParam("trackId", trackId.trim());
                        }
                        return uriBuilder.build();
                    })
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .toEntity(String.class);
        } catch (RestClientResponseException ex) {
            log.error("Node.js getRoadmapHistory error: status={}, body={}", ex.getStatusCode(), ex.getResponseBodyAsString());
            return ResponseEntity.status(ex.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ex.getResponseBodyAsString());
        }
    }
    public ResponseEntity<String> updateProgress(String roadmapId, String userId, UpdateRoadmapProgressRequestDTO req) {
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("userId", userId);
            body.put("stepId", req.getStepId());
            if (req.getTopicId() != null && !req.getTopicId().isBlank()) {
                body.put("topicId", req.getTopicId());
            }
            body.put("status", req.getStatus());
            return restClient.patch()
                    .uri("/api/roadmaps/{roadmapId}/progress", roadmapId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toEntity(String.class);
        } catch (RestClientResponseException ex) {
            log.error("Node.js updateProgress error: status={}, body={}", ex.getStatusCode(), ex.getResponseBodyAsString());
            return ResponseEntity.status(ex.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ex.getResponseBodyAsString());
        }
    }
}
