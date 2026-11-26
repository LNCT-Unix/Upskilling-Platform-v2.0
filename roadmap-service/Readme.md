# Roadmap Service (`roadmap-service`)

Internal Node.js (Express + Mongoose + Google Gemini) microservice for the Upskilling Platform. It generates personalized, prerequisite-ordered learning roadmaps from graded diagnostic assessments, stores versioned roadmaps in MongoDB, and tracks learner progress.

---

## Tech Stack
- **Runtime:** Node.js (CommonJS)
- **Framework:** Express 5
- **Database:** MongoDB via Mongoose (`roadmaps` collection)
- **AI:** Google Gemini via `@google/genai` (structured JSON output)

---

## Project Structure

```text
roadmap-service/
├── src/
│   ├── app.js                                # Express app, global /api auth, route mounting, DB startup
│   ├── config/
│   │   └── db.js                             # MongoDB connection helper
│   ├── controllers/
│   │   └── roadmapController.js              # createRoadmap, getRoadmap, getRoadmapHistory, updateRoadmapProgress
│   ├── middlewares/
│   │   ├── verifyInternalAuth.js             # Timing-safe x-internal-secret check
│   │   └── validateRoadmapRequest.js         # Request validation & requireUserId middleware
│   ├── models/
│   │   ├── Roadmap.js                        # Versioned roadmap schema + embedded progress + indexes
│   │   └── LearningResource.js               # Reserved for future curated/RAG resources
│   ├── routes/
│   │   └── roadmapRoutes.js                  # /api/roadmaps/* routes
│   └── services/
│       └── aiService.js                      # Gemini prompt/schema, deterministic validation, version archiving
├── documentation.md                          # Spring Boot Team Integration Guide (API Contract)
├── package.json
└── .env
```

---

## Environment Variables (`.env`)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/upskilling_roadmaps
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.8-flash
PROMPT_VERSION=roadmap-v1
INTERNAL_API_KEY=your_shared_internal_secret
```

---

## Running Locally

```bash
npm install
npm run dev     # development with nodemon
# or
npm start       # production
```

---

## API Endpoints (`/api/roadmaps`)

All `/api/*` routes require `x-internal-secret: <INTERNAL_API_KEY>`.

| Method | Path | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/roadmaps/generate` | Generate a new `ACTIVE` roadmap (idempotent on `{ userId, requestId }`) and archive previous `ACTIVE` versions. |
| `GET` | `/api/roadmaps/me` | Fetch the latest `ACTIVE` roadmap for `userId` (optional `trackId` filter). |
| `GET` | `/api/roadmaps/me/history` | Fetch all roadmap versions (`ACTIVE` and `ARCHIVED`) sorted newest first. |
| `PATCH` | `/api/roadmaps/:roadmapId/progress` | Update a topic or step status (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`) and recalculate `percentComplete`. |

For full request/response schemas and integration rules for the Spring Boot gateway, see [documentation.md](./documentation.md).
