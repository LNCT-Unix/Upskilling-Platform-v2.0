package com.aiupskillingplatform.services.roadmap;

import com.aiupskillingplatform.dto.roadmap.*;
import com.aiupskillingplatform.entities.*;
import com.aiupskillingplatform.repositories.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RoadmapPageService {

    private final RoadmapCategoryRepository categoryRepository;
    private final RoadmapStepRepository stepRepository;
    private final RoadmapTopicRepository topicRepository;
    private final RoadmapResourceRepository resourceRepository;
    private final RoadmapUserProgressRepository userProgressRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public RoadmapStructureResponseDTO getRoadmapStructure() {
        List<RoadmapCategory> categories = categoryRepository.findAllByOrderByIdAsc();
        List<RoadmapStep> steps = stepRepository.findAllByOrderByIdAsc();
        List<RoadmapTopic> topics = topicRepository.findAllByOrderByOrderAsc();

        // Group topics by step_id
        Map<Integer, List<TopicDTO>> topicsByStepId = new LinkedHashMap<>();
        for (RoadmapTopic topic : topics) {
            Integer stepId = topic.getStep().getId();
            topicsByStepId.computeIfAbsent(stepId, k -> new ArrayList<>())
                    .add(new TopicDTO(
                            topic.getId(),
                            topic.getName(),
                            topic.getPoints() != null ? topic.getPoints() : Collections.emptyList()
                    ));
        }

        // Group steps by category_id
        Map<Integer, List<StepDTO>> stepsByCategoryId = new LinkedHashMap<>();
        for (RoadmapStep step : steps) {
            Integer catId = step.getCategory().getId();
            List<TopicDTO> stepTopics = topicsByStepId.getOrDefault(step.getId(), Collections.emptyList());
            stepsByCategoryId.computeIfAbsent(catId, k -> new ArrayList<>())
                    .add(new StepDTO(
                            step.getId(),
                            step.getTitle(),
                            stepTopics
                    ));
        }

        List<CategoryDTO> categoryDTOs = new ArrayList<>();
        for (RoadmapCategory cat : categories) {
            List<StepDTO> catSteps = stepsByCategoryId.getOrDefault(cat.getId(), Collections.emptyList());
            categoryDTOs.add(new CategoryDTO(
                    cat.getId(),
                    cat.getTitle(),
                    catSteps
            ));
        }

        return new RoadmapStructureResponseDTO(categoryDTOs);
    }

    @Transactional(readOnly = true)
    public UserProgressResponseDTO getUserProgress(UUID userId) {
        List<String> completed = userProgressRepository.findCompletedTopicKeysByUserId(userId);
        return new UserProgressResponseDTO(completed != null ? completed : Collections.emptyList());
    }

    @Transactional
    public UserProgressResponseDTO updateProgress(UUID userId, String topicKey, boolean done) {
        if (!topicRepository.existsById(topicKey)) {
            throw new EntityNotFoundException("Topic not found: " + topicKey);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

        if (done) {
            Optional<RoadmapUserProgress> existing = userProgressRepository.findByUserIdAndTopicKey(userId, topicKey);
            if (existing.isEmpty()) {
                RoadmapUserProgress progress = new RoadmapUserProgress();
                progress.setUser(user);
                progress.setTopicKey(topicKey);
                progress.setCompletedAt(Instant.now());
                userProgressRepository.save(progress);
            }
        } else {
            userProgressRepository.deleteByUserIdAndTopicKey(userId, topicKey);
        }

        return getUserProgress(userId);
    }

    @Transactional(readOnly = true)
    public List<TopicResourceResponseDTO> getTopicResources(String topicKey, String type) {
        if (!topicRepository.existsById(topicKey)) {
            throw new EntityNotFoundException("Topic not found: " + topicKey);
        }

        List<RoadmapResource> resources;
        if (type == null || type.isBlank() || "all".equalsIgnoreCase(type.trim())) {
            resources = resourceRepository.findByTopicId(topicKey);
        } else {
            String normalizedType = normalizeResourceType(type.trim());
            if (normalizedType == null) {
                return Collections.emptyList();
            }
            resources = resourceRepository.findByTopicIdAndTypeIgnoreCase(topicKey, normalizedType);
        }

        List<TopicResourceResponseDTO> dtos = new ArrayList<>(resources.size());
        for (RoadmapResource res : resources) {
            dtos.add(new TopicResourceResponseDTO(res.getTitle(), res.getUrl()));
        }
        return dtos;
    }

    private String normalizeResourceType(String type) {
        String lower = type.toLowerCase();
        if (lower.equals("videos") || lower.equals("video") || lower.equals("youtube")) {
            return "videos";
        }
        if (lower.equals("docs") || lower.equals("doc") || lower.equals("documentation")) {
            return "docs";
        }
        if (lower.equals("courses") || lower.equals("course") || lower.equals("online_resource")) {
            return "courses";
        }
        return null;
    }
}
