# Roadmap Service (`roadmap-service`) — Documentation & Implementation Plan

## 1. Overview & Key Decisions
`roadmap-service` is an internal Node.js (Express + Mongoose + Google Gemini) microservice in the Upskilling Platform.

**Current Team Scope & Deviations from Reference Guide:**
1. **Node.js owns MongoDB:** Unlike the original reference doc (where Spring Boot manages MongoDB), **`roadmap-service` owns MongoDB** for storing personalized roadmaps, version history (`ACTIVE` / `ARCHIVED`), and learner progress.
2. **No RAG for now:** Instead of retrieving resources from a vector/RAG pipeline, Gemini generates structured roadmap steps directly with **video links, tutorials, and official documentation references** (`https://` URLs), validated deterministically before saving.
3. **Aligned with Existing Skill Graph + Assessment Questions:** Spring Boot already has the Skill DAG (`SkillGraphService`) and runs the diagnostic assessment (`AssessmentService` / `UserSkillMastery`). When generating a roadmap, Spring Boot sends the learner's **graded `assessment` summary and `questions` results** (alongside optional Skill Graph `skills` / `dependencies` context) to `roadmap-service`.

---

## 2. Target Architecture

| Component | Responsibility |
| :--- | :--- |
| **React Frontend** | Displays diagnostic assessment results, "Generate My Roadmap" button, loading/retry states, active roadmap with clickable video/tutorial/doc links (`videos`, `docs`, `courses`), progress toggles, and history. Never calls `roadmap-service` directly. |
| **Spring Boot Gateway** | Authenticates the user (JWT), verifies assessment completion in PostgreSQL, sends the graded `assessment` summary + `questions` results (and optional Skill Graph `skills` / `dependencies`) + `userId` to Node.js with `x-internal-secret`, and proxies read/progress calls. |
| **Node.js (`roadmap-service`)** | Validates internal requests, calls `@google/genai` with structured JSON output, validates AI output (URLs, prerequisite order, hours), archives old `ACTIVE` roadmaps, and handles all MongoDB reads/writes/progress updates. |
| **PostgreSQL** | Existing source of truth for users, tracks, skills, skill dependencies, questions, and `user_skill_mastery`. |
| **MongoDB** | Managed by `roadmap-service`; stores personalized roadmap documents, versions, generation metadata, and progress. |

---

## 3. Environment & Security Configuration

### Environment Variables (`.env`)
Ensure `roadmap-service/.env` defines:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/upskilling_roadmaps
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
PROMPT_VERSION=roadmap-v1
INTERNAL_API_KEY=your_shared_internal_secret
```

### Internal Authentication & Ownership Rules
* All `/api/*` endpoints are protected by `src/middlewares/verifyInternalAuth.js` using header `x-internal-secret` and `crypto.timingSafeEqual`.
* Because `roadmap-service` does not verify browser JWTs, Spring Boot must pass the verified `userId` (UUID string in `req.body.userId` for `POST` / `PATCH`, or query / `x-user-id` header for `GET`).
* Every MongoDB read/update **must** filter by `userId` (e.g., `{ _id: roadmapId, userId }`) so one learner can never read or modify another learner's roadmap.
* Never forward passwords, JWT tokens, emails, or unnecessary PII to Gemini.

---

## 4. API Contract (Internal: Spring Boot → Node.js)

Base mount in `src/app.js`: `/api/roadmaps`  
Required header on every request: `x-internal-secret: <INTERNAL_API_KEY>`

### 4.1 Generate Roadmap
`POST /api/roadmaps/generate`

Triggered only when the learner explicitly clicks **"Generate My Roadmap"** after completing the test. Spring Boot sends the graded **`assessment`** summary and **`questions`** results (plus optional Skill Graph `skills` and `dependencies` if available).

> **Security & Grading Rule:** Spring Boot must grade answers first (`isCorrect: true/false`, `score`) before calling `roadmap-service`. Never ask Gemini to grade raw user answers or send answer keys unless needed for summary context.

#### Request Body
```json
{
  "requestId": "req-uuid-1234",
  "userId": "e7c2e0b1-4f32-4d2a-92b1-52643a60a7d9",
  "trackId": "11111111-2222-3333-4444-555555555555",
  "assessmentRef": "backend-development-attempt-1",
  "targetRole": "Backend Developer",
  "studyHoursPerWeek": 10,
  "assessment": {
    "assessmentId": "backend-development-attempt-1",
    "trackSlug": "backend-development",
    "difficulty": "BEGINNER",
    "totalQuestions": 12,
    "correctCount": 7,
    "wrongCount": 5,
    "score": 2
  },
  "questions": [
    {
      "questionId": "99887766-5544-3322-1100-aabbccddeeff",
      "skillSlug": "variables-data-types",
      "skillName": "Variables & Data Types",
      "difficulty": "BEGINNER",
      "questionText": "Which of the following data types in Java is 64-bit?",
      "isCorrect": true
    },
    {
      "questionId": "44556677-8899-0011-2233-445566778899",
      "skillSlug": "spring-framework-ioc",
      "skillName": "Spring Framework IoC",
      "difficulty": "INTERMEDIATE",
      "questionText": "Which annotation marks a class as a Spring-managed service bean?",
      "isCorrect": false
    }
  ],
  "skills": [
    {
      "skillSlug": "variables-data-types",
      "name": "Variables & Data Types",
      "categoryName": "Core Programming",
      "difficultyLevel": "BEGINNER",
      "status": "UNLOCKED",
      "masteryScore": 0.0
    },
    {
      "skillSlug": "spring-framework-ioc",
      "name": "Spring Framework IoC",
      "categoryName": "Backend Frameworks",
      "difficultyLevel": "INTERMEDIATE",
      "status": "LOCKED",
      "masteryScore": 0.0
    }
  ],
  "dependencies": [
    { "prerequisite": "variables-data-types", "dependent": "classes-objects" },
    { "prerequisite": "classes-objects", "dependent": "spring-framework-ioc" }
  ]
}
```

#### Field Rules
* `requestId` *(string, recommended)*: Idempotency key per button click. If `{ userId, requestId }` already exists, return the existing roadmap (`200`) instead of calling Gemini again.
* `userId` *(string, required)*: Authenticated user UUID from Spring Boot.
* `trackId` *(string, recommended)*: Track UUID from `SkillGraphResponseDTO.trackId`.
* `targetRole` *(string, required)*: Non-empty target role / track name.
* `assessment` *(object, recommended)*: Graded test summary (`assessmentId`, `trackSlug`, `difficulty`, `totalQuestions`, `correctCount`, `wrongCount`, `score`).
* `questions` *(array, required if `skills` is omitted)*: Graded question outcomes (`questionId`, `skillSlug`, `skillName`, `difficulty`, `questionText`, `isCorrect`).
* `skills` *(array, optional / recommended)*: Skill graph status items (`UNLOCKED`, `LOCKED`, `ASSESSED`, `NOT_ASSESSED`).
* `dependencies` *(array, optional)*: Prerequisite edges `{ prerequisite, dependent }` slugs from the Skill Graph.

#### Success Response (`201 Created`, or `200 OK` on duplicate `requestId`)
```json
{
  "success": true,
  "data": {
    "_id": "6745abc123...",
    "userId": "e7c2e0b1-4f32-4d2a-92b1-52643a60a7d9",
    "trackId": "11111111-2222-3333-4444-555555555555",
    "assessmentRef": "backend-development-attempt-1",
    "requestId": "req-uuid-1234",
    "targetRole": "Backend Developer",
    "studyHoursPerWeek": 10,
    "version": 1,
    "status": "ACTIVE",
    "percentComplete": 0,
    "generation": {
      "model": "gemini-2.5-flash",
      "promptVersion": "roadmap-v1",
      "createdAt": "2026-11-26T00:00:00.000Z"
    },
    "skillAnalysis": [
      {
        "skillSlug": "variables-data-types",
        "name": "Variables & Data Types",
        "categoryName": "Core Programming",
        "difficultyLevel": "BEGINNER",
        "status": "UNLOCKED",
        "masteryScore": 0.0,
        "confidence": 0.0,
        "evidenceCount": 1,
        "priority": "LOW"
      }
    ],
    "skillGaps": ["spring-framework-ioc"],
    "steps": [
      {
        "stepId": "step-1",
        "sequence": 1,
        "category": "Spring Boot and Backend Development",
        "title": "Spring Framework IoC & Dependency Injection",
        "skill": "spring-framework-ioc",
        "level": "intermediate",
        "prerequisites": ["classes-objects"],
        "estimatedHours": 10,
        "status": "NOT_STARTED",
        "reason": "Spring Framework IoC is still LOCKED while your Java OOP prerequisite is ready.",
        "topics": [
          {
            "topicId": "step-1-0",
            "name": "IoC Container Basics",
            "points": ["ApplicationContext", "Bean lifecycle", "Component scanning"],
            "status": "NOT_STARTED"
          },
          {
            "topicId": "step-1-1",
            "name": "Dependency Injection",
            "points": ["Constructor injection", "@Autowired", "@Qualifier"],
            "status": "NOT_STARTED"
          }
        ],
        "project": {
          "title": "Bean Wiring Mini-App",
          "description": "Build a console/REST service demonstrating constructor injection and profiles."
        },
        "resources": [
          {
            "resourceId": null,
            "title": "Spring IoC Container Reference",
            "url": "https://docs.spring.io/spring-framework/reference/core/beans.html",
            "type": "documentation",
            "platform": "Spring.io",
            "description": "Official documentation on Spring IoC container and bean lifecycle."
          },
          {
            "resourceId": null,
            "title": "Spring Dependency Injection Explained",
            "url": "https://www.youtube.com/watch?v=9SGDpanrc8U",
            "type": "video",
            "platform": "YouTube",
            "description": "Video walkthrough of IoC and dependency injection."
          },
          {
            "resourceId": null,
            "title": "Intro to Inversion of Control and Dependency Injection",
            "url": "https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring",
            "type": "tutorial",
            "platform": "Baeldung",
            "description": "Step-by-step tutorial with code examples."
          }
        ]
      }
    ],
    "createdAt": "2026-11-26T00:00:00.000Z",
    "updatedAt": "2026-11-26T00:00:00.000Z"
  }
}
```

### 4.2 Get Active Roadmap
`GET /api/roadmaps/me?userId=<userId>&trackId=<trackId>` *(or `x-user-id` header)*
* Returns the single `ACTIVE` roadmap for `(userId, trackId)`.
* `200 OK`: `{ "success": true, "data": { ...roadmap } }`
* `404 Not Found`: `{ "success": false, "message": "No active roadmap found" }`

### 4.3 Get Roadmap Version History
`GET /api/roadmaps/me/history?userId=<userId>&trackId=<trackId>` *(or `x-user-id` header)*
* Returns all versions (`ACTIVE` and `ARCHIVED`) sorted by `{ version: -1 }`.
* `200 OK`: `{ "success": true, "data": [ ...roadmaps ] }`

### 4.4 Update Topic / Step Progress
`PATCH /api/roadmaps/:roadmapId/progress`

#### Request Body
Update either a specific sub-topic (`topicId`) or an entire step (`stepId`) after verifying `userId` ownership:
```json
{
  "userId": "e7c2e0b1-4f32-4d2a-92b1-52643a60a7d9",
  "stepId": "step-1",
  "topicId": "step-1-0",
  "status": "COMPLETED"
}
```
* `topicId` *(optional)*: If provided, updates that topic's `status` and automatically derives the parent step's `status` (`COMPLETED` when all topics are done, `IN_PROGRESS` if partially done, `NOT_STARTED` if none). If omitted, updates `stepId`'s `status` directly.
* Allowed `status` values: `"NOT_STARTED"`, `"IN_PROGRESS"`, `"COMPLETED"`.
* `200 OK`: `{ "success": true, "data": { ...updatedRoadmap } }`
* `400 Bad Request`: Invalid `roadmapId`, missing `stepId` (and `topicId`), or invalid `status`.
* `404 Not Found`: Roadmap/step/topic not found or does not belong to `userId`.

---

## 5. MongoDB Data Model (`src/models/Roadmap.js` — Updated)

Collection: `roadmaps`

* **Top-level fields:** `userId`, `trackId`, `targetRole`, `assessmentRef`, `assessment` (`assessmentId`, `trackSlug`, `difficulty`, `totalQuestions`, `correctCount`, `wrongCount`, `score`, `questions[]`), `requestId`, `studyHoursPerWeek`, `status` (`ACTIVE` | `ARCHIVED`), `version`, `percentComplete`, `generation` (`model`, `promptVersion`, `createdAt`), `skillAnalysis`, `skillGaps`, `steps`, `createdAt`, `updatedAt`.
* **Step & Topic Hierarchy (`roadmap.jsx` compatible):** Each step includes `category`, `sequence`, `title`, `skill`, `level`, `prerequisites`, `estimatedHours`, `status`, `reason`, `topics: [{ topicId, name, points[], status }]`, `project`, and `resources`.
* **Embedded progress:** Progress lives on `steps[].topics[].status` and `steps[].status`, plus top-level `percentComplete`, so reads and progress updates stay atomic on one document.
* **Resource types supported:** `"video"`, `"tutorial"`, `"documentation"`, `"article"`, `"course"`, `"project"` (aligns with `roadmap.jsx` resource filters). `resourceId` is nullable for now and kept for future RAG integration with `src/models/LearningResource.js`.
* **Indexes:**
  * `{ userId: 1, trackId: 1, status: 1 }` — active roadmap lookup
  * `{ userId: 1, trackId: 1, version: -1 }` — version history lookup
  * `{ userId: 1, requestId: 1 }` (`unique: true`, `partialFilterExpression: { requestId: { $type: "string" } }`) — duplicate-click idempotency without colliding on `null`

---

## 6. What You Have To Do (Actionable Task Checklist)

### Step 1: Fix Dependencies & Environment (`package.json`, `.env`)
- [ ] Add `mongoose` to `dependencies` in `package.json` (`npm install mongoose`). Currently `src/config/db.js` and `src/models/*.js` require `mongoose`, but it is missing from `package.json`.
- [ ] Add `GEMINI_MODEL`, `PROMPT_VERSION`, and `INTERNAL_API_KEY` to `.env`.

### Step 2: Update the Roadmap Schema (`src/models/Roadmap.js`)
- [x] Updated `Roadmap.js` with `trackId`, `assessment` (including `questions[]` outcomes), `requestId`, `studyHoursPerWeek`, `status` (`ACTIVE`/`ARCHIVED`), `percentComplete`, `generation`, `skillAnalysis`, step `category`/`sequence`/`estimatedHours`/`status`/`topics` (`topicId`, `name`, `points`, `status`)/`project`, enriched `resources` (`video`, `tutorial`, `documentation`, `article`, `course`, `project`), and compound/partial indexes.
- [ ] Decide on `src/models/RoadmapProgress.js`: since progress is now embedded in `Roadmap.steps` + `percentComplete`, remove or deprecate `RoadmapProgress.js` when cleaning up so there is a single source of truth.

### Step 3: Upgrade Request Validation (`src/middlewares/validateRoadmapRequest.js`)
- [ ] Update `validateRoadmapRequest` for `POST /generate`:
  - Require `userId`, `targetRole`, and at least one diagnostic input (`questions` non-empty array and/or `skills` non-empty array).
  - Validate `assessment` (if provided) and `questions` items (`skillSlug`/`questionText`, boolean `isCorrect`).
  - Accept and validate optional/recommended fields: `trackId`, `requestId`, `studyHoursPerWeek`, `skills`, and `dependencies` (`[{ prerequisite, dependent }]`).
- [ ] Add a user-identity middleware (e.g., `requireUserId`) for `GET /me`, `GET /me/history`, and `PATCH /:roadmapId/progress` (reading `userId` from query, body, or `x-user-id` header).

### Step 4: Upgrade AI Generation & Validation (`src/services/aiService.js`)
- [ ] Read model name from `process.env.GEMINI_MODEL` and prompt version from `process.env.PROMPT_VERSION`.
- [ ] Expand `roadmapResponseSchema` (`@google/genai` `Type`) to output `skillGaps` and `steps` with `stepId`, `sequence`, `category`, `title`, `skill`, `level`, `prerequisites`, `estimatedHours`, `reason`, `topics` (`topicId`, `name`, `points`), `project`, and `resources` (`title`, `url`, `type`, `platform`, `description`).
- [ ] Update the prompt to:
  - Use `targetRole`, `studyHoursPerWeek`, `assessment` + `questions` (which questions/skills the learner answered `isCorrect: true` vs `false`), plus any `skills` (`UNLOCKED` / `LOCKED` / `NOT_ASSESSED`) and `dependencies`.
  - Instruct Gemini **not** to treat `NOT_ASSESSED` skills as weak or failed.
  - Include **2–3 topics per step** (each with concise bullet `points`) and **2–3 resources per step** mixing **official documentation**, **video links**, and **tutorials** with real `https://` URLs (no placeholder URLs).
- [ ] Add a timeout (`AbortSignal.timeout`) around the Gemini call.
- [ ] Add deterministic post-LLM validation before saving:
  - Reject empty `steps` or duplicate `stepId`s / `topicId`s.
  - Validate every `resources[].url` with `new URL(url)` (`protocol === "https:"`), filtering or rejecting invalid URLs.
  - Verify prerequisite ordering against `dependencies` and sanity-check `estimatedHours`.
- [ ] Implement safe version switching (works on standalone MongoDB without replica-set transactions):
  - Only after validation passes, insert the new roadmap with `status: "ACTIVE"`, `version: nextVersion`, `skillAnalysis`, and `generation` metadata.
  - Then archive all older `ACTIVE` roadmaps for `(userId, trackId)` where `_id` != `newDoc._id` (`status: "ARCHIVED"`).

### Step 5: Fix & Complete Controllers (`src/controllers/roadmapController.js`)
- [ ] Fix existing bugs:
  - Import `Roadmap` (`const Roadmap = require("../models/Roadmap.js");`).
  - Remove the broken `Roadmap.find({ userId: req.params.userId })` call in `createRoadmap`.
- [ ] Add `requestId` idempotency check in `createRoadmap` (if `{ userId, requestId }` already exists, return `200` with the existing document).
- [ ] Implement all 4 controller functions:
  - `createRoadmap` (`POST /generate`) → returns `201` with `{ success: true, data: savedRoadmap }`.
  - `getActiveRoadmap` (`GET /me`) → returns latest `ACTIVE` roadmap (`sort({ version: -1 })`) for `{ userId, trackId }` or `404`.
  - `getRoadmapHistory` (`GET /me/history`) → returns all versions sorted `{ version: -1 }`.
  - `updateRoadmapProgress` (`PATCH /:roadmapId/progress`) → validates `ObjectId`, filters by `{ _id: roadmapId, userId }`, updates matching `topicId` (or `stepId`) status, derives step status from topics, recalculates `percentComplete`, saves, and returns `200` (or `404` if not found/not owned).
- [ ] Ensure error responses never leak raw Gemini errors, keys, or stack traces.

### Step 6: Wire Routes (`src/routes/roadmapRoutes.js`)
- [ ] Keep `POST /generate` (`validateRoadmapRequest`, `createRoadmap`).
- [ ] Add `GET /me` (`getActiveRoadmap`).
- [ ] Add `GET /me/history` (`getRoadmapHistory`).
- [ ] Add `PATCH /:roadmapId/progress` (`updateRoadmapProgress`).
- [ ] Confirm with the Spring Boot teammate whether Spring Boot calls `/api/roadmaps/...` (current mount in `src/app.js`) or `/internal/roadmaps/...`.

---

## 7. Verification Checklist (Test Before Integrating Frontend)

Test directly against `http://localhost:3000/api/roadmaps` using Postman or `curl`:
1. **Auth Failure:** Call any route without `x-internal-secret` → expect `401`.
2. **Happy Path Generate:** `POST /generate` with `UNLOCKED`, `LOCKED`, and `NOT_ASSESSED` skills plus `dependencies` → expect `201`, `version: 1`, `status: "ACTIVE"`, valid prerequisite order, and `video` / `tutorial` / `documentation` `https://` links on every step.
3. **Duplicate Click (`requestId`):** Repeat `POST /generate` with the same `requestId` → expect existing roadmap returned without creating `version: 2`.
4. **Regeneration:** `POST /generate` with a new `requestId` → `version: 1` becomes `ARCHIVED`, `version: 2` is `ACTIVE`.
5. **Active & History Reads:** `GET /me` returns only `version: 2`; `GET /me/history` returns `[v2, v1]`.
6. **Progress & Ownership Isolation:** `PATCH /:roadmapId/progress` updates `status` and `percentComplete` for the owning `userId`, and returns `404` when a different `userId` is supplied.
7. **Invalid AI Output / Timeout:** Simulate malformed AI JSON or timeout → expect `502` and verify the existing `ACTIVE` roadmap in MongoDB is untouched.
