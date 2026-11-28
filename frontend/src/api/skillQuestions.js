import { API_BASE_URL } from "./config";
import { getAuthToken } from "./auth";

// Cache to prevent duplicate API requests when re-clicking the same skill
const questionsCache = new Map();

/**
 * Fetch 5 questions for a given skill from the backend API.
 * Throws an error if the request fails or returns no questions.
 */
export async function fetchQuestionsBySkill(skill) {
  if (!skill) {
    throw new Error("No skill selected.");
  }

  const skillIdentifier = skill.id || skill.slug;
  if (!skillIdentifier) {
    throw new Error("Skill identifier is missing.");
  }

  if (questionsCache.has(skillIdentifier)) {
    return questionsCache.get(skillIdentifier);
  }

  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/skills/${encodeURIComponent(skillIdentifier)}/questions?limit=5`;
  const response = await fetch(url, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || `Failed to load questions (${response.status})`);
  }

  const list = Array.isArray(data) ? data : data.questions || [];
  if (list.length === 0) {
    throw new Error("No questions available for this skill.");
  }

  const formatted = list.slice(0, 5).map((q, idx) => ({
    id: q.id || `q-${skillIdentifier}-${idx}`,
    text: q.questionText || q.text || q.question || `Question ${idx + 1}`,
    options: q.options || q.optionData || {},
    difficulty: q.difficulty || skill.difficultyLevel || "BEGINNER",
  }));

  questionsCache.set(skillIdentifier, formatted);
  return formatted;
}
