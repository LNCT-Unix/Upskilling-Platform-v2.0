# Assessment Architecture

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
