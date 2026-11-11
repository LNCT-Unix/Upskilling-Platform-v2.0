# Assessment Architecture

## Overview (In Simple Points)

1. **Fixed Skill Sequence per Track**: Each track (currently `backend-development`) maps to an ordered list of **12 core skills** in `AssessmentService`.
2. **Authentication Required**: Both starting an assessment and submitting answers require a valid JWT (`currentUser(auth)` returns `401 Unauthorized` if the user is not logged in).
3. **Starting the Assessment (`GET /api/tracks/{trackSlug}/assessment/start`)**:
   - Looks up the 12-skill list for the requested `trackSlug`.
   - Normalizes the requested `difficulty` (`BEGINNER`, `MEDIUM`, or `HARD`, defaulting to `BEGINNER`).
   - Loads the first skill (`index = 0`), picks a random matching question (falling back to any difficulty for that skill if none match), checks the user's current skill status (`LOCKED` / `UNLOCKED`), and returns `AssessmentStepResponse`.
4. **Submitting an Answer (`POST /api/tracks/{trackSlug}/assessment/answers`)**:
   - **Step 1 — Validation & Lookups**: Verifies the track, authenticates the user, fetches the `questionId` (`404` if missing), resolves its linked skill (`404` if unlinked), and finds the skill's position (`answeredIndex`) in the track's assessment list (`400` if it does not belong to the track).
   - **Step 2 — Grading**: Compares `selectedAnswer` with `question.correctAnswer` (trimmed, case-insensitive) to set `correct = true` or `false`.
   - **Step 3 — Skill Unlocking**: If `correct == true`, calls `unlockIfLocked(user, skill)`. If the user has no `user_skill_mastery` row for that skill yet, it creates one; if the status is `null` or `LOCKED`, it updates the status to `UNLOCKED` and saves it.
   - **Step 4 — Next Question / Completion**: Builds the next step at `answeredIndex + 1`:
     - If `index >= 12`, returns `completed = true` with `question = null` and `"Assessment completed successfully."`.
     - Otherwise, loads the next active skill and picks a question for it, returning `AnswerResultResponse` (`correct`, `correctAnswer`, `explanation`, and `next`).

---

## Answer Submission Flow (`AssessmentService.submitAnswer`)

```mermaid
flowchart TD
    Client(["Client Browser"]) -. "POST /api/tracks/:trackSlug/assessment/answers" .-> Submit["AssessmentService.submitAnswer"]
    Submit --> SkillsForTrack

    subgraph S1["1. Validations and Lookups (for track, auth, question_id)"]
        SkillsForTrack["skillsForTrack(trackSlug)"] --> CurrentUser["currentUser(auth)"]
        CurrentUser --> FindQuestion["questionRepository.findById"]
        FindQuestion -- "Not found" --> Err404Question["404 Question not found"]
        FindQuestion -- "Found" --> FindSkills["findSkillsByQuestionId, take first"]
        FindSkills -- "None" --> Err404Link["throw 404 Question not linked to a skill"]
        FindSkills -- "Found" --> AnsweredIdx["answeredIndex = slugs.indexOf(skill slug)"]
        AnsweredIdx --> IdxCheck{"answeredIndex < 0?"}
        IdxCheck -- "Yes" --> Err400["400 Bad Request"]
    end

    IdxCheck -- "No" --> IsCorrect

    subgraph S2["2. Grading"]
        IsCorrect["isCorrect(question, selectedAnswer)"] --> AnswerMatch{"Answer matches?"}
        AnswerMatch -- "No" --> CorrectFalse["correct = false"]
        AnswerMatch -- "Yes" --> CorrectTrue["correct = true"]
    end

    CorrectTrue --> FindMastery
    CorrectFalse --> BuildStep

    subgraph S3["3. unlockIfLocked"]
        FindMastery["masteryRepository.findByUserIdAndSkillId"] --> MasteryExists{"Mastery row exists?"}
        MasteryExists -- "No" --> CreateLocked["Create new row with status LOCKED"]
        MasteryExists -- "Yes" --> StatusCheck{"status null or LOCKED?"}
        CreateLocked --> StatusCheck
        StatusCheck -- "Yes" --> SetUnlocked["Set UNLOCKED and save"]
        StatusCheck -- "No" --> KeepStatus["Keep current status"]
    end

    SetUnlocked --> BuildStep
    KeepStatus --> BuildStep

    subgraph S4["4. buildStep for next question"]
        BuildStep["buildStep(slugs, answeredIndex + 1, difficulty, user)"] --> IndexCheck{"index >= total?"}
        IndexCheck -- "Yes" --> Completed["Completed response, question is null"]
        IndexCheck -- "No" --> FindActiveSkill["findBySlugAndActiveTrue"]
        FindActiveSkill -- "Missing" --> Err404Skill["404 Skill not found"]
        FindActiveSkill -- "Found" --> PickQuestion["pickQuestion(skill, difficulty)"]
        PickQuestion -- "Empty" --> Err404NoQ["404 No questions available"]
        PickQuestion -- "Found" --> NextStep["statusFor + parseOptions, build next step"]
    end

    Completed --> Result["new AnswerResultResponse"]
    NextStep --> Result
    Result --> Ok(["ResponseEntity.ok"])
```
