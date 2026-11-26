# Roadmap Service (`roadmap-service`) — Spring Boot Integration Guide

This document is the integration contract between the **Spring Boot Backend** and **`roadmap-service`** (Node.js + Express + MongoDB + Gemini).

---

## 1. Architecture & Responsibilities

| Service | Responsibility |
| :--- | :--- |
| **React Frontend** | Never calls `roadmap-service` directly. Calls Spring Boot with the user's JWT. |
| **Spring Boot (Gateway)** | Authenticates the user (JWT), grades the diagnostic assessment in PostgreSQL, sends graded results + `userId` to `roadmap-service` with `x-internal-secret`, and proxies roadmap read/progress calls. |
| **Node.js (`roadmap-service`)** | Verifies `x-internal-secret`, calls Gemini (`@google/genai`), validates AI output (HTTPS URLs, prerequisite order, hours), stores versioned roadmaps in MongoDB (`ACTIVE` / `ARCHIVED`), and manages progress updates. |

---

## 2. Base URL & Authentication

* **Base URL (local):** `http://localhost:3000/api/roadmaps`
* **Required Header on EVERY `/api/*` request:**
  ```http
  x-internal-secret: <INTERNAL_API_KEY>
  ```
* **User Identity (`userId`):**
  * Because `roadmap-service` does not parse browser JWTs, Spring Boot must pass the verified user UUID:
    * In `req.body.userId` for `POST` and `PATCH`
    * In query param `?userId=<uuid>` or header `x-user-id: <uuid>` for `GET`
  * Every MongoDB read and update filters by `userId`, so one learner can never access or modify another learner's roadmap.

> **Security Rule:** Grade assessment answers in Spring Boot **before** calling `roadmap-service`. Never forward JWTs, passwords, emails, or raw answer keys.

---

## 3. Endpoints

### 3.1 Generate Personalized Roadmap
`POST /api/roadmaps/generate`

Trigger this only when the learner explicitly clicks **"Generate My Roadmap"** after completing an assessment.

#### Request Body
```json
{
  "requestId": "req-test-001",
  "userId": "e7c2e0b1-4f32-4d2a-92b1-52643a60a7d9",
  "trackId": "11111111-2222-3333-4444-555555555555",
  "assessmentRef": "backend-development-attempt-1",
  "targetRole": "Backend Developer",
  "studyHoursPerWeek": 10,
  "assessment": {
    "assessmentId": "backend-development-attempt-1",
    "trackSlug": "backend-development",
    "difficulty": "BEGINNER",
    "totalQuestions": 4,
    "correctCount": 2,
    "wrongCount": 2,
    "score": 50
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
      "masteryScore": 1.0
    },
    {
      "skillSlug": "spring-framework-ioc",
      "name": "Spring Framework IoC",
      "categoryName": "Backend Frameworks",
      "difficultyLevel": "INTERMEDIATE",
      "status": "LOCKED",
      "masteryScore": 0.0
    },
    {
      "skillSlug": "docker-basics",
      "name": "Docker Basics",
      "categoryName": "DevOps",
      "difficultyLevel": "INTERMEDIATE",
      "status": "NOT_ASSESSED",
      "masteryScore": 0.0
    }
  ],
  "dependencies": [
    { "prerequisite": "variables-data-types", "dependent": "classes-objects" },
    { "prerequisite": "classes-objects", "dependent": "spring-framework-ioc" }
  ]
}
```

#### Field Validation Rules
| Field | Required | Notes |
| :--- | :--- | :--- |
| `userId` | **Yes** | Non-empty string (or number) |
| `targetRole` | **Yes** | Non-empty string |
| `questions` / `skills` | **At least one** | At least one must be a non-empty array. Each question needs boolean `isCorrect` + (`skillSlug` or `questionText`). Each skill needs `skillSlug` or `name`. |
| `requestId` | Recommended | Idempotency key per button click. Duplicate `(userId, requestId)` returns `200 OK` with the existing roadmap instead of calling Gemini again. |
| `trackId` | Recommended | Used for versioning (`v1`, `v2`, ...) and `ACTIVE`/`ARCHIVED` scoping per track. |
| `studyHoursPerWeek` | Optional | Number `>= 1`. |
| `assessment` | Optional | Graded summary object. |
| `dependencies` | Optional | Array of `{ prerequisite, dependent }` slugs; AI output order is validated against these edges. |

#### Responses
* **`201 Created`** (new roadmap generated; previous `ACTIVE` roadmap for `(userId, trackId)` becomes `ARCHIVED`)
* **`200 OK`** (duplicate `requestId` — returns existing roadmap)
* **`400 Bad Request`** (validation error)
* **`401 Unauthorized`** (missing or invalid `x-internal-secret`)
* **`502 Bad Gateway`** (Gemini timeout/failure or invalid AI output — existing `ACTIVE` roadmap remains untouched)

```json
{
  "success": true,
  "data": {
    "_id": "6b0844381f205b5b5a811e13",
    "userId": "e7c2e0b1-4f32-4d2a-92b1-52643a60a7d9",
    "trackId": "11111111-2222-3333-4444-555555555555",
    "targetRole": "Backend Developer",
    "assessmentRef": "backend-development-attempt-1",
    "requestId": "req-test-001",
    "studyHoursPerWeek": 10,
    "status": "ACTIVE",
    "version": 1,
    "percentComplete": 0,
    "generation": {
      "model": "gemini-3.8-flash",
      "promptVersion": "roadmap-v1",
      "createdAt": "2026-11-26T14:37:44.826Z"
    },
    "assessment": {
      "assessmentId": "backend-development-attempt-1",
      "trackSlug": "backend-development",
      "difficulty": "BEGINNER",
      "totalQuestions": 4,
      "correctCount": 2,
      "wrongCount": 2,
      "score": 50,
      "questions": [
        {
          "questionId": "99887766-5544-3322-1100-aabbccddeeff",
          "skillSlug": "variables-data-types",
          "skillName": "Variables & Data Types",
          "difficulty": "BEGINNER",
          "questionText": "Which of the following data types in Java is 64-bit?",
          "isCorrect": true
        }
      ]
    },
    "skillAnalysis": [
      {
        "skillSlug": "variables-data-types",
        "name": "Variables & Data Types",
        "categoryName": "Core Programming",
        "difficultyLevel": "BEGINNER",
        "status": "UNLOCKED",
        "masteryScore": 1,
        "confidence": null,
        "evidenceCount": 1,
        "priority": "LOW"
      },
      {
        "skillSlug": "spring-framework-ioc",
        "name": "Spring Framework IoC",
        "categoryName": "Backend Frameworks",
        "difficultyLevel": "INTERMEDIATE",
        "status": "LOCKED",
        "masteryScore": 0,
        "confidence": null,
        "evidenceCount": 1,
        "priority": "HIGH"
      },
      {
        "skillSlug": "docker-basics",
        "name": "Docker Basics",
        "categoryName": "DevOps",
        "difficultyLevel": "INTERMEDIATE",
        "status": "NOT_ASSESSED",
        "masteryScore": 0,
        "confidence": null,
        "evidenceCount": 0,
        "priority": "MEDIUM"
      }
    ],
    "skillGaps": ["Spring Framework IoC", "RESTful APIs"],
    "steps": [
      {
        "stepId": "step-1",
        "sequence": 1,
        "category": "Backend Frameworks",
        "title": "Mastering Spring Framework & IoC Container",
        "skill": "Spring Framework IoC",
        "level": "intermediate",
        "prerequisites": ["Classes & Objects", "Variables & Data Types"],
        "estimatedHours": 10,
        "status": "NOT_STARTED",
        "reason": "You missed the Spring IoC assessment question; understanding Inversion of Control and Dependency Injection is essential for structuring modern Java enterprise backends.",
        "topics": [
          {
            "topicId": "step-1-0",
            "name": "Inversion of Control & ApplicationContext",
            "points": [
              "Core concept of IoC vs traditional object instantiation",
              "BeanFactory versus ApplicationContext in Spring",
              "Spring Bean lifecycle callbacks and configuration scopes"
            ],
            "status": "NOT_STARTED"
          },
          {
            "topicId": "step-1-1",
            "name": "Spring Core Annotations & Dependency Injection",
            "points": [
              "Configuring beans with @Component, @Service, and @Repository",
              "Constructor injection versus setter and field injection",
              "Using @Autowired, @Qualifier, and @Value annotations"
            ],
            "status": "NOT_STARTED"
          }
        ],
        "project": {
          "title": "Dependency Injection Service Container",
          "description": "Build a command-line application using Spring Core that configures and injects decoupled notification, logging, and user management services via constructor injection."
        },
        "resources": [
          {
            "resourceId": null,
            "title": "Spring Core Technologies Documentation",
            "url": "https://docs.spring.io/spring-framework/reference/core.html",
            "type": "documentation",
            "platform": "Spring",
            "description": "Official documentation detailing IoC containers, bean definitions, and dependency injection."
          },
          {
            "resourceId": null,
            "title": "Spring Framework Tutorial for Beginners",
            "url": "https://www.youtube.com/watch?v=If1Lw4pLLEo",
            "type": "video",
            "platform": "YouTube - Amigoscode",
            "description": "Comprehensive video walkthrough covering the core principles of Spring IoC and bean management."
          },
          {
            "resourceId": null,
            "title": "Baeldung - Inversion of Control and Dependency Injection in Spring",
            "url": "https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring",
            "type": "tutorial",
            "platform": "Baeldung",
            "description": "Practical guide explaining component scanning, bean definitions, and autowiring strategies."
          }
        ]
      }
    ],
    "createdAt": "2026-11-26T14:37:44.878Z",
    "updatedAt": "2026-11-26T14:37:44.878Z"
  }
}
```

---

### 3.2 Get Active Roadmap
`GET /api/roadmaps/me?userId=<userId>&trackId=<trackId>`

* `trackId` is optional; if provided, filters to that track.
* Returns the latest `ACTIVE` roadmap sorted by `{ version: -1 }`.
* **`200 OK`**: Same `{ "success": true, "data": { ... } }` structure as Section 3.1.
* **`404 Not Found`**:
  ```json
  {
    "success": false,
    "message": "No active Roadmap found"
  }
  ```

---

### 3.3 Get Roadmap Version History
`GET /api/roadmaps/me/history?userId=<userId>&trackId=<trackId>`

* Returns all versions (`ACTIVE` and `ARCHIVED`) sorted by `{ version: -1 }`.
* **`200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "6b08469f1f205b5b5a811e25",
        "userId": "e7c2e0b1-4f32-4d2a-92b1-52643a60a7d9",
        "trackId": "11111111-2222-3333-4444-555555555555",
        "targetRole": "Backend Developer",
        "status": "ACTIVE",
        "version": 2,
        "percentComplete": 0,
        "steps": [ ... ]
      },
      {
        "_id": "6b0844381f205b5b5a811e13",
        "userId": "e7c2e0b1-4f32-4d2a-92b1-52643a60a7d9",
        "trackId": "11111111-2222-3333-4444-555555555555",
        "targetRole": "Backend Developer",
        "status": "ARCHIVED",
        "version": 1,
        "percentComplete": 25,
        "steps": [ ... ]
      }
    ]
  }
  ```

---

### 3.4 Update Topic / Step Progress
`PATCH /api/roadmaps/:roadmapId/progress`

#### Request Body
```json
{
  "userId": "e7c2e0b1-4f32-4d2a-92b1-52643a60a7d9",
  "stepId": "step-1",
  "topicId": "step-1-0",
  "status": "COMPLETED"
}
```
* `status`: must be `"NOT_STARTED"`, `"IN_PROGRESS"`, or `"COMPLETED"`.
* `topicId` *(optional)*:
  * If provided, updates that topic's `status` and automatically derives the parent step's `status` (`COMPLETED` when all topics are done, `IN_PROGRESS` when partially done, `NOT_STARTED` when none).
  * If omitted, updates `stepId`'s `status` directly.
* Automatically recalculates `percentComplete` (`0`–`100`).

#### Success Response (`200 OK`)
Returns the full updated roadmap with the new `percentComplete`, derived `steps[].status`, and updated `topics[].status`:
```json
{
  "success": true,
  "data": {
    "_id": "6b0844381f205b5b5a811e13",
    "userId": "e7c2e0b1-4f32-4d2a-92b1-52643a60a7d9",
    "status": "ACTIVE",
    "version": 1,
    "percentComplete": 25,
    "steps": [
      {
        "stepId": "step-1",
        "status": "IN_PROGRESS",
        "topics": [
          { "topicId": "step-1-0", "name": "Inversion of Control & ApplicationContext", "status": "COMPLETED" },
          { "topicId": "step-1-1", "name": "Spring Core Annotations & Dependency Injection", "status": "NOT_STARTED" }
        ]
      }
    ]
  }
}
```
* **`400 Bad Request`**: Invalid `roadmapId`, missing `stepId`, or invalid `status`.
* **`404 Not Found`**: Roadmap, step, or topic not found, or `roadmapId` does not belong to `userId`.

---

### 3.5 Standard Error Response Format
All `4xx` and `5xx` errors follow this shape:
```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

| Status | When it happens |
| :--- | :--- |
| `400` | Missing/invalid `userId`, `targetRole`, `questions`/`skills`, `roadmapId`, `stepId`, or `status` |
| `401` | Missing or invalid `x-internal-secret` header |
| `404` | Active roadmap, step, or topic not found (or `roadmapId` belongs to another `userId`) |
| `500` | Unexpected server/database error |
| `502` | Gemini timeout/failure or invalid AI output (existing `ACTIVE` roadmap is untouched) |

---

## 4. Spring Boot Integration Notes

1. **HTTP Timeout:** `POST /api/roadmaps/generate` calls Gemini and has a `45s` AI timeout on the Node.js side. Configure Spring Boot's `RestClient` / `WebClient` read timeout for this endpoint to at least **60 seconds**.
2. **Idempotency:** Generate a UUID `requestId` per user click (or pass one from the frontend) so retries or double-clicks don't trigger duplicate Gemini calls.
3. **Environment Config:** Ensure Spring Boot's `application.yml` / `.env` uses the exact same `INTERNAL_API_KEY` value as `roadmap-service` and sends it in the `x-internal-secret` header.
