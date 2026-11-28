package com.aiupskillingplatform.controllers.milestone;

import com.aiupskillingplatform.entities.MilestoneQuestion;
import com.aiupskillingplatform.entities.Skill;
import com.aiupskillingplatform.repositories.MilestoneQuestionRepository;
import com.aiupskillingplatform.repositories.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillQuestionController {

    private final SkillRepository skillRepository;
    private final MilestoneQuestionRepository milestoneQuestionRepository;

    @GetMapping("/{skillId}/questions")
    public ResponseEntity<List<Map<String, Object>>> getSkillQuestions(
            @PathVariable String skillId,
            @RequestParam(defaultValue = "5") int limit) {

        Skill skill = resolveSkill(skillId);
        List<MilestoneQuestion> activeQuestions = milestoneQuestionRepository.findBySkillIdAndIsActiveTrue(skill.getId());

        if (activeQuestions.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No active questions available for skill: " + skill.getName());
        }

        int cappedLimit = Math.max(1, Math.min(limit, activeQuestions.size()));
        List<Map<String, Object>> response = new ArrayList<>(cappedLimit);
        for (int i = 0; i < cappedLimit; i++) {
            MilestoneQuestion q = activeQuestions.get(i);
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", q.getId().toString());
            item.put("questionText", q.getQuestionText());
            item.put("options", q.getOptions() != null ? q.getOptions() : Collections.emptyMap());
            item.put("difficulty", q.getDifficulty() != null ? q.getDifficulty() : "BEGINNER");
            response.add(item);
        }

        return ResponseEntity.ok(response);
    }

    private Skill resolveSkill(String identifier) {
        if (identifier == null || identifier.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "skillId is required");
        }
        String trimmed = identifier.trim();
        try {
            UUID uuid = UUID.fromString(trimmed);
            return skillRepository.findById(uuid)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found with id: " + trimmed));
        } catch (IllegalArgumentException e) {
            return skillRepository.findBySlug(trimmed)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found with slug: " + trimmed));
        }
    }
}
