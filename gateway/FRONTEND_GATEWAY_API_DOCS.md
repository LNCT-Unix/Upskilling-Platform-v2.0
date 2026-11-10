# Gateway API Documentation for Frontend Team

Welcome to the API specification for the **AI Upskilling Platform Gateway**. This document details all available REST endpoints, request/response models, authentication flows, error structures, and ready-to-use TypeScript/JavaScript `fetch` examples.

---

## 1. General Architecture & Conventions

### Base URL
- **Local Development**: `http://localhost:8080` (or `http://127.0.0.1:8080`)
- **Configurable Port**: Driven by `SERVER_PORT` environment variable (defaults to `8080`).

### Authentication Scheme
- **Standard**: JWT (JSON Web Token) in HTTP `Authorization` Header.
- **Header Format**:
  ```http
  Authorization: Bearer <your_jwt_access_token>
  ```
- **Token Type**: Returned as `"Bearer"` upon successful login (`/api/auth/login`).
- **Token Expiry**: Default is 24 hours (`86,400,000` ms).

### CORS Policy
- Allowed Origins: `http://localhost:*`, `http://127.0.0.1:*` (supports credentialed cross-origin requests).
- Allowed Methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`.
- Exposed Headers: `Authorization`.

### Standard Error Response Format
When any DAG/dependency/validation or standard business exception occurs, the server responds with:

```json
{
  "timestamp": "2026-11-10T15:48:22.123Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Detailed error message describing what went wrong",
  "path": "/api/dependencies",
  "validationErrors": {
    "prerequisiteSkillId": "Prerequisite skill ID is required"
  }
}
```

---

## 2. API Endpoint Matrix

| Method | Endpoint | Auth Required | Roles | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/health` | No | Any | System health check |
| `POST` | `/api/auth/register` | No | Any | User registration |
| `POST` | `/api/auth/login` | No | Any | User login & JWT issuance |
| `GET` | `/api/tracks/{trackId}/graph` | No | Any | Get static skill DAG for a track |
| `GET` | `/api/tracks/{trackSlug}/assessment/start` | Optional | Any | Start adaptive assessment / get 1st question |
| `POST` | `/api/tracks/{trackSlug}/assessment/answers` | Optional | Any | Submit assessment answer & progress |
| `GET` | `/api/progress/tracks/{trackId}/graph` | **Yes** | Any Authenticated | Get personalized DAG with user mastery |
| `GET` | `/api/dependencies/skills/{skillId}/prerequisites` | **Yes** | Any Authenticated | Fetch prerequisites of a specific skill |
| `POST` | `/api/dependencies` | **Yes** | `ADMIN` only | Create a new directed skill dependency edge |
| `DELETE` | `/api/dependencies/{dependencyId}` | **Yes** | `ADMIN` only | Delete an existing skill dependency edge |

---

## 3. Endpoints Breakdown & Usage

---

### 3.1. Health Check

#### `GET /api/health`
Check if the gateway service is online and running.

- **Authentication**: None
- **Response Status**: `200 OK`
- **Response Body**:
  ```text
  The server is live
  ```

#### Fetch Call
```typescript
export async function checkServerHealth(): Promise<string> {
  const response = await fetch('http://localhost:8080/api/health');
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }
  return response.text();
}
```

---

### 3.2. Authentication

#### `POST /api/auth/register`
Register a new user account.

- **Authentication**: None
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!",
    "fullName": "Jane Doe"
  }
  ```
  - `email`: Required, valid email format, max 255 chars.
  - `password`: Required, min 8 chars, max 72 chars.
  - `fullName`: Required, non-blank, max 100 chars.

- **Success Response**: `201 Created`
  ```json
  {
    "id": "e7c2e0b1-4f32-4d2a-92b1-52643a60a7d9",
    "email": "user@example.com",
    "fullName": "Jane Doe",
    "username": "janedoe",
    "role": "LEARNER"
  }
  ```

#### Fetch Call
```typescript
interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
}

interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  username: string;
  role: 'LEARNER' | 'ADMIN';
}

export async function register(payload: RegisterPayload): Promise<UserResponse> {
  const response = await fetch('http://localhost:8080/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json();
}
```

---

#### `POST /api/auth/login`
Authenticate existing user and obtain a JWT token.

- **Authentication**: None
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIi...",
    "tokenType": "Bearer",
    "user": {
      "id": "e7c2e0b1-4f32-4d2a-92b1-52643a60a7d9",
      "email": "user@example.com",
      "fullName": "Jane Doe",
      "username": "janedoe",
      "role": "LEARNER"
    }
  }
  ```

#### Fetch Call
```typescript
interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: UserResponse;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Invalid credentials');
  }

  const data: AuthResponse = await response.json();
  // Persist token in localStorage / memory store
  localStorage.setItem('accessToken', data.accessToken);
  return data;
}
```

---

### 3.3. Skill DAG & Graph

#### `GET /api/tracks/{trackId}/graph`
Get the static Directed Acyclic Graph (nodes and edges) for a learning track.

- **Authentication**: None (Public)
- **Path Parameters**:
  - `trackId` (UUID): The unique ID of the track.
- **Success Response**: `200 OK`
  ```json
  {
    "trackId": "11111111-2222-3333-4444-555555555555",
    "nodes": [
      {
        "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
        "name": "Variables & Data Types",
        "slug": "variables-data-types",
        "difficultyLevel": "BEGINNER",
        "sortOrder": 1,
        "categoryName": "Core Programming",
        "status": "AVAILABLE",
        "masteryScore": null,
        "prerequisiteNames": []
      },
      {
        "id": "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
        "name": "Object-Oriented Programming",
        "slug": "classes-objects",
        "difficultyLevel": "INTERMEDIATE",
        "sortOrder": 2,
        "categoryName": "Core Programming",
        "status": "LOCKED",
        "masteryScore": null,
        "prerequisiteNames": ["Variables & Data Types"]
      }
    ],
    "edges": [
      {
        "prerequisiteSkillId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
        "dependentSkillId": "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e"
      }
    ]
  }
  ```

#### Fetch Call
```typescript
interface SkillGraphNode {
  id: string;
  name: string;
  slug: string;
  difficultyLevel: string;
  sortOrder: number;
  categoryName: string;
  status: 'AVAILABLE' | 'LOCKED' | 'COMPLETED' | 'IN_PROGRESS';
  masteryScore: number | null;
  prerequisiteNames: string[];
}

interface SkillGraphEdge {
  prerequisiteSkillId: string;
  dependentSkillId: string;
}

interface SkillGraphResponse {
  trackId: string;
  nodes: SkillGraphNode[];
  edges: SkillGraphEdge[];
}

export async function getTrackInitialGraph(trackId: string): Promise<SkillGraphResponse> {
  const response = await fetch(`http://localhost:8080/api/tracks/${trackId}/graph`);
  if (!response.ok) {
    throw new Error(`Failed to load track graph: ${response.status}`);
  }
  return response.json();
}
```

---

#### `GET /api/progress/tracks/{trackId}/graph`
Get the personalized DAG for the logged-in user, where node statuses (`AVAILABLE`, `LOCKED`, `COMPLETED`) and `masteryScore` are computed dynamically from user progress.

- **Authentication**: Required (`Bearer <token>`)
- **Path Parameters**:
  - `trackId` (UUID): The unique ID of the track.
- **Query Parameters**:
  - `threshold` (Optional, double between `0.0` and `1.0`): Custom mastery cutoff (default in application config is `0.75`).
- **Success Response**: `200 OK`
  ```json
  {
    "trackId": "11111111-2222-3333-4444-555555555555",
    "nodes": [
      {
        "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
        "name": "Variables & Data Types",
        "slug": "variables-data-types",
        "difficultyLevel": "BEGINNER",
        "sortOrder": 1,
        "categoryName": "Core Programming",
        "status": "COMPLETED",
        "masteryScore": 0.88,
        "prerequisiteNames": []
      },
      {
        "id": "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
        "name": "Object-Oriented Programming",
        "slug": "classes-objects",
        "difficultyLevel": "INTERMEDIATE",
        "sortOrder": 2,
        "categoryName": "Core Programming",
        "status": "AVAILABLE",
        "masteryScore": 0.45,
        "prerequisiteNames": ["Variables & Data Types"]
      }
    ],
    "edges": [
      {
        "prerequisiteSkillId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
        "dependentSkillId": "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e"
      }
    ]
  }
  ```

#### Fetch Call
```typescript
export async function getPersonalizedGraph(
  trackId: string,
  threshold?: number
): Promise<SkillGraphResponse> {
  const token = localStorage.getItem('accessToken');
  const url = new URL(`http://localhost:8080/api/progress/tracks/${trackId}/graph`);
  if (threshold !== undefined) {
    url.searchParams.set('threshold', threshold.toString());
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch user progress graph');
  }

  return response.json();
}
```

---

### 3.4. Adaptive IRT Assessment

The assessment flow tests skills in the track, unlocks them when passed, and dynamically adapts.

#### `GET /api/tracks/{trackSlug}/assessment/start`
Start an assessment for a track or get the first question.

- **Authentication**: Optional (Guest allowed, or authenticated to record mastery).
- **Path Parameters**:
  - `trackSlug` (string): e.g. `backend-development`.
- **Query Parameters**:
  - `difficulty` (Optional, defaults to `"BEGINNER"`): Difficulty level.
- **Success Response**: `200 OK`
  ```json
  {
    "questionIndex": 0,
    "questionNumber": 1,
    "totalQuestions": 12,
    "completed": false,
    "skill": {
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "name": "Variables & Data Types",
      "slug": "variables-data-types",
      "categoryName": "Core Programming",
      "categoryId": "c1c2c3c4-0000-1111-2222-333344445555",
      "status": "LOCKED"
    },
    "question": {
      "id": "99887766-5544-3322-1100-aabbccddeeff",
      "text": "Which of the following data types in Java is 64-bit?",
      "type": "MULTIPLE_CHOICE",
      "options": ["int", "long", "short", "byte"],
      "difficulty": "BEGINNER"
    },
    "message": null
  }
  ```

#### Fetch Call
```typescript
interface AssessmentSkill {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  categoryId: string;
  status: string;
}

interface AssessmentQuestion {
  id: string;
  text: string;
  type: string;
  options: string[] | Record<string, any>;
  difficulty: string;
}

interface AssessmentStepResponse {
  questionIndex: number;
  questionNumber: number;
  totalQuestions: number;
  completed: boolean;
  skill: AssessmentSkill | null;
  question: AssessmentQuestion | null;
  message: string | null;
}

export async function startAssessment(
  trackSlug: string,
  difficulty: string = 'BEGINNER'
): Promise<AssessmentStepResponse> {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `http://localhost:8080/api/tracks/${trackSlug}/assessment/start?difficulty=${encodeURIComponent(difficulty)}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(`Assessment start failed: ${response.status}`);
  }

  return response.json();
}
```

---

#### `POST /api/tracks/{trackSlug}/assessment/answers`
Submit an answer to the current question. The backend evaluates correctness, updates user mastery (if user is authenticated), and provides the next question or completion signal.

- **Authentication**: Optional (Guest allowed, or authenticated to record progress).
- **Path Parameters**:
  - `trackSlug` (string): e.g. `backend-development`.
- **Request Body**:
  ```json
  {
    "questionId": "99887766-5544-3322-1100-aabbccddeeff",
    "selectedAnswer": "long",
    "difficulty": "BEGINNER"
  }
  ```
  *(Note: Supports camelCase `questionId`/`selectedAnswer` or snake_case `question_id`/`selected_answer`)*.

- **Success Response**: `200 OK`
  ```json
  {
    "correct": true,
    "correctAnswer": "long",
    "explanation": "In Java, a long is a signed 64-bit two's complement integer.",
    "next": {
      "questionIndex": 1,
      "questionNumber": 2,
      "totalQuestions": 12,
      "completed": false,
      "skill": {
        "id": "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
        "name": "Classes & Objects",
        "slug": "classes-objects",
        "categoryName": "Core Programming",
        "categoryId": "c1c2c3c4-0000-1111-2222-333344445555",
        "status": "UNLOCKED"
      },
      "question": {
        "id": "44556677-8899-0011-2233-445566778899",
        "text": "What is an instance of a class called?",
        "type": "MULTIPLE_CHOICE",
        "options": ["Variable", "Object", "Method", "Interface"],
        "difficulty": "BEGINNER"
      },
      "message": null
    }
  }
  ```

- **When Assessment Finishes**:
  ```json
  {
    "correct": true,
    "correctAnswer": "long",
    "explanation": "...",
    "next": {
      "questionIndex": 12,
      "questionNumber": 12,
      "totalQuestions": 12,
      "completed": true,
      "skill": null,
      "question": null,
      "message": "Assessment complete!"
    }
  }
  ```

#### Fetch Call
```typescript
interface SubmitAnswerPayload {
  questionId: string;
  selectedAnswer: string;
  difficulty?: string;
}

interface AnswerResultResponse {
  correct: boolean;
  correctAnswer: string;
  explanation: string;
  next: AssessmentStepResponse;
}

export async function submitAssessmentAnswer(
  trackSlug: string,
  payload: SubmitAnswerPayload
): Promise<AnswerResultResponse> {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `http://localhost:8080/api/tracks/${trackSlug}/assessment/answers`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to submit answer');
  }

  return response.json();
}
```

---

### 3.5. Skill Dependencies & Prerequisites

#### `GET /api/dependencies/skills/{skillId}/prerequisites`
Get the list of prerequisite skills that must be learned before the given skill.

- **Authentication**: Required (`Bearer <token>`)
- **Path Parameters**:
  - `skillId` (UUID): ID of target skill.
- **Success Response**: `200 OK`
  ```json
  [
    {
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "name": "Variables & Data Types",
      "slug": "variables-data-types",
      "description": "Fundamental data types and variable declarations",
      "difficultyLevel": "BEGINNER",
      "estimatedMinutes": 45,
      "sortOrder": 1,
      "active": true
    }
  ]
  ```

#### Fetch Call
```typescript
interface SkillResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  difficultyLevel: string;
  estimatedMinutes: number;
  sortOrder: number;
  active: boolean;
}

export async function getSkillPrerequisites(skillId: string): Promise<SkillResponse[]> {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`http://localhost:8080/api/dependencies/skills/${skillId}/prerequisites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load prerequisites: ${response.status}`);
  }

  return response.json();
}
```

---

#### `POST /api/dependencies` (Admin Only)
Add a dependency edge between two skills (`prerequisiteSkillId -> dependentSkillId`). Automatically checks for circular dependencies.

- **Authentication**: Required (`Bearer <token>`) with role `ROLE_ADMIN`
- **Request Body**:
  ```json
  {
    "prerequisiteSkillId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "dependentSkillId": "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "id": "8f3b2c1a-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
    "prerequisiteSkillId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "prerequisiteSkillName": "Variables & Data Types",
    "dependentSkillId": "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
    "dependentSkillName": "Classes & Objects"
  }
  ```
- **Error Response (Cycle detected)**: `409 Conflict` or `400 Bad Request`

#### Fetch Call
```typescript
interface SkillDependencyRequest {
  prerequisiteSkillId: string;
  dependentSkillId: string;
}

interface SkillDependencyResponse {
  id: string;
  prerequisiteSkillId: string;
  prerequisiteSkillName: string;
  dependentSkillId: string;
  dependentSkillName: string;
}

export async function addSkillDependency(
  payload: SkillDependencyRequest
): Promise<SkillDependencyResponse> {
  const token = localStorage.getItem('accessToken');
  const response = await fetch('http://localhost:8080/api/dependencies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add dependency');
  }

  return response.json();
}
```

---

#### `DELETE /api/dependencies/{dependencyId}` (Admin Only)
Remove an existing skill dependency edge.

- **Authentication**: Required (`Bearer <token>`) with role `ROLE_ADMIN`
- **Path Parameters**:
  - `dependencyId` (UUID): ID of the dependency record to remove.
- **Success Response**: `204 No Content` (Empty body)

#### Fetch Call
```typescript
export async function removeSkillDependency(dependencyId: string): Promise<void> {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`http://localhost:8080/api/dependencies/${dependencyId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to remove dependency: ${response.status}`);
  }
}
```

---

## 4. Frontend Universal API Client (Recommended Setup)

To avoid writing boilerplate headers in every component, here is a clean and reusable API helper module (`apiClient.ts`):

```typescript
// src/api/apiClient.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { requiresAuth = true, headers = {}, ...rest } = options;
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (requiresAuth && token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    headers: requestHeaders,
  });

  if (response.status === 204) {
    return {} as T;
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorBody.message || `HTTP error ${response.status}`);
  }

  return response.json();
}
```

### Example Usage with the Client:
```typescript
// 1. Login
const auth = await apiClient<AuthResponse>('/api/auth/login', {
  method: 'POST',
  requiresAuth: false,
  body: JSON.stringify({ email: 'user@test.com', password: 'secretpassword' }),
});
localStorage.setItem('accessToken', auth.accessToken);

// 2. Fetch Progress Graph
const graph = await apiClient<SkillGraphResponse>(`/api/progress/tracks/${trackId}/graph`);

// 3. Submit Assessment
const nextStep = await apiClient<AnswerResultResponse>(`/api/tracks/backend-development/assessment/answers`, {
  method: 'POST',
  body: JSON.stringify({
    questionId: currentQuestionId,
    selectedAnswer: 'long',
  }),
});
```

---

## 5. HTTP Status Code Cheat Sheet

| Code | Meaning | Typical Scenario |
| :--- | :--- | :--- |
| `200 OK` | Successful retrieval / update | Graph queries, health check, logins, assessments |
| `201 Created` | Resource created successfully | User registration, adding a skill dependency |
| `204 No Content`| Successfully processed with no content | Deleting a skill dependency |
| `400 Bad Request`| Malformed request or validation failure | Missing fields, invalid range for threshold, dependency cycle |
| `401 Unauthorized` | Missing, invalid, or expired JWT | Accessing protected routes without `Bearer` token |
| `403 Forbidden` | Authenticated but insufficient permissions | Regular user attempting `ADMIN`-only dependency endpoints |
| `404 Not Found` | Resource doesn't exist | Skill ID or Track ID not found in database |
| `409 Conflict` | Conflict with current state | Circular dependency creation |
| `500 Server Error` | Unhandled backend exception | Database connection error |

