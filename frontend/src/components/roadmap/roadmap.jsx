import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import { getAuthToken, clearAuthSession } from "../../api/auth";
import logo from "../../assets/octobyte-logo.jpeg";

const STORAGE_KEY = "roadmapCompletedTopics";

const resourceTypes = [
  ["videos", "▶ Video lectures"],
  ["docs", "📄 Docs"],
  ["courses", "🎓 Courses"],
];

const badgeStyle = {
  Completed: "bg-green-100 text-green-700",
  "In Progress": "bg-violet-100 text-violet-700",
  Locked: "bg-slate-100 text-slate-500",
  LEARNED: "bg-green-100 text-green-700",
  FRONTIER: "bg-violet-100 text-violet-700",
  LOCKED: "bg-slate-100 text-slate-500",
};

function OctoByteLogo({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 select-none cursor-pointer"
    >
      <img
        src={logo}
        alt="OctoByte Logo"
        className="h-12 w-auto object-contain"
      />
    </div>
  );
}

export default function Roadmap() {
  const navigate = useNavigate();

  // Roadmap data from backend
  const [categories, setCategories] = useState([]);
  const [completed, setCompleted] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI states
  const [openCategory, setOpenCategory] = useState(null);
  const [openStep, setOpenStep] = useState(null);
  const [openResource, setOpenResource] = useState(null);
  const [resourceType, setResourceType] = useState(null);

  // Resource data cache: { `${topicKey}-${type}`: [ { title, url } ] }
  const [resources, setResources] = useState({});
  const [resourceLoading, setResourceLoading] = useState(null);
  const [resourceError, setResourceError] = useState("");

  // Helper to construct authorization headers
  const getAuthHeaders = useCallback(() => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, []);

  // 1. Fetch roadmap structure and user progress on mount
  useEffect(() => {
    async function loadRoadmap() {
      const token = getAuthToken();
      if (!token) {
        clearAuthSession();
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [roadmapRes, progressRes] = await Promise.all([
          fetch(`${API_BASE_URL}/roadmap`, {
            method: "GET",
            headers,
          }),
          fetch(`${API_BASE_URL}/roadmap/progress`, {
            method: "GET",
            headers,
          }),
        ]);

        if (roadmapRes.status === 401 || progressRes.status === 401) {
          clearAuthSession();
          navigate("/login");
          return;
        }

        if (!roadmapRes.ok) {
          throw new Error(`Roadmap API error: ${roadmapRes.status}`);
        }

        const roadmapData = await roadmapRes.json();
        setCategories(roadmapData.categories || []);

        if (progressRes.ok) {
          const progressData = await progressRes.json();
          const completedTopics = Array.isArray(progressData.completed)
            ? progressData.completed
            : [];
          setCompleted(completedTopics);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(completedTopics));
        } else {
          // Fallback to locally saved progress if progress endpoint returned non-OK status
          try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            setCompleted(Array.isArray(saved) ? saved : []);
          } catch {
            setCompleted([]);
          }
        }
      } catch (err) {
        console.error("Roadmap loading error:", err);
        setError("Could not load roadmap. Please check backend connection.");
      } finally {
        setLoading(false);
      }
    }

    loadRoadmap();
  }, [navigate]);

  // Helpers: normalize step and topic data from backend DTOs
  const getStepId = useCallback((step) => {
    return Array.isArray(step) ? step[0] : step.id;
  }, []);

  const getStepTitle = useCallback((step) => {
    return Array.isArray(step) ? step[1] : step.title;
  }, []);

  const getStepTopics = useCallback((step) => {
    return Array.isArray(step) ? step[2] : step.topics || [];
  }, []);

  const getTopicName = useCallback((topic) => {
    return Array.isArray(topic) ? topic[0] : topic.name;
  }, []);

  const getTopicPoints = useCallback((topic) => {
    return Array.isArray(topic) ? topic[1] : topic.points || [];
  }, []);

  const getTopicKey = useCallback((step, topic, index) => {
    if (!Array.isArray(topic) && topic.id !== undefined && topic.id !== null) {
      return String(topic.id);
    }
    const stepId = Array.isArray(step) ? step[0] : step.id;
    return `${stepId}-${index}`;
  }, []);

  // Flattened list of all steps across all categories for sequential prerequisite check
  const allSteps = useMemo(() => {
    return categories.flatMap((category) => category.steps || []);
  }, [categories]);

  // Check whether all topics in a given step are completed
  const isStepDone = useCallback(
    (step) => {
      const topics = getStepTopics(step);
      return (
        topics.length > 0 &&
        topics.every((topic, index) =>
          completed.includes(getTopicKey(step, topic, index))
        )
      );
    },
    [completed, getStepTopics, getTopicKey]
  );

  // Check whether a step is unlocked
  // The very first step is unlocked by default; every subsequent step unlocks after its predecessor is completed.
  const isStepUnlocked = useCallback(
    (step) => {
      const currentId = getStepId(step);
      const currentIndex = allSteps.findIndex(
        (item) => String(getStepId(item)) === String(currentId)
      );

      if (currentIndex === 0) return true;
      if (currentIndex === -1) return false;

      return isStepDone(allSteps[currentIndex - 1]);
    },
    [allSteps, getStepId, isStepDone]
  );

  // Category status calculation
  const getCategoryStatus = useCallback(
    (category) => {
      const steps = category.steps || [];
      if (steps.length > 0 && steps.every(isStepDone)) {
        return "Completed";
      }
      if (steps.length > 0 && isStepUnlocked(steps[0])) {
        return "In Progress";
      }
      return "Locked";
    },
    [isStepDone, isStepUnlocked]
  );

  // Step status calculation
  const getStepStatus = useCallback(
    (step) => {
      if (isStepDone(step)) return "Completed";
      return isStepUnlocked(step) ? "In Progress" : "Locked";
    },
    [isStepDone, isStepUnlocked]
  );

  // 2. Tick / untick a topic - connects to PUT /api/roadmap/progress/{topicKey}
  const toggleTopic = async (topicKey) => {
    const isCurrentlyDone = completed.includes(topicKey);
    const newDone = !isCurrentlyDone;

    // Optimistic UI update
    const optimisticCompleted = newDone
      ? [...completed, topicKey]
      : completed.filter((k) => k !== topicKey);
    setCompleted(optimisticCompleted);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(optimisticCompleted));

    try {
      const token = getAuthToken();
      if (!token) {
        clearAuthSession();
        navigate("/login");
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/roadmap/progress/${encodeURIComponent(topicKey)}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ done: newDone }),
        }
      );

      if (res.status === 401) {
        clearAuthSession();
        navigate("/login");
        return;
      }

      if (!res.ok) {
        throw new Error(`Progress API error: ${res.status}`);
      }

      const data = await res.json();
      if (data && Array.isArray(data.completed)) {
        setCompleted(data.completed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.completed));
      }
    } catch (err) {
      console.error("Failed to update progress on backend:", err);
      // Revert optimistic update on server error
      setCompleted(completed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    }
  };

  // 3. Fetch resources when user selects Videos / Docs / Courses for a topic
  // Connects to GET /api/roadmap/topics/{topicKey}/resources?type={type}
  async function loadResources(topicKey, type) {
    const cacheKey = `${topicKey}-${type}`;

    // Avoid duplicate fetching if already cached
    if (resources[cacheKey]) return;

    try {
      setResourceLoading(cacheKey);
      setResourceError("");

      const token = getAuthToken();
      if (!token) {
        clearAuthSession();
        navigate("/login");
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/roadmap/topics/${encodeURIComponent(topicKey)}/resources?type=${type}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (res.status === 401) {
        clearAuthSession();
        navigate("/login");
        return;
      }

      if (!res.ok) {
        throw new Error(`Resource API error: ${res.status}`);
      }

      const data = await res.json();
      setResources((prev) => ({
        ...prev,
        [cacheKey]: Array.isArray(data) ? data : [],
      }));
    } catch (err) {
      console.error("Resource loading error:", err);
      setResourceError("Could not load resources.");
    } finally {
      setResourceLoading(null);
    }
  }

  const selectedCategory = categories.find((item) => item.id === openCategory);

  // Loading state screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg font-semibold text-violet-700">
          Loading roadmap...
        </p>
      </div>
    );
  }

  // Error state screen
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <p className="text-red-500 font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-violet-600 px-6 py-2 text-white hover:bg-violet-700 cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      {/* Roadmap content */}
      <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Learning Roadmap
        </h2>

        <p className="text-slate-600 mb-6">
          Your customized path to master backend development.
        </p>

        {/* Empty categories state */}
        {categories.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            <p className="text-lg font-semibold text-slate-700 mb-2">
              No roadmap data found.
            </p>
            <p className="text-sm text-slate-500">
              The backend returned 0 roadmap categories. Ensure database migrations and roadmap seed data are applied.
            </p>
          </div>
        )}

        {/* Page 1: Categories View */}
        {!selectedCategory && categories.length > 0 && (
          <div className="space-y-4">
            {categories.map((cat) => {
              const status = getCategoryStatus(cat);
              const locked = status === "Locked" || status === "LOCKED";
              const steps = cat.steps || [];
              const done = steps.filter(isStepDone).length;

              return (
                <button
                  key={cat.id}
                  disabled={locked}
                  onClick={() => setOpenCategory(cat.id)}
                  className={`w-full rounded-2xl bg-white p-5 shadow flex items-center justify-between text-left ${
                    locked
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer hover:shadow-md"
                  }`}
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {locked && "🔒 "}
                      {cat.id}. {cat.title}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {done} of {steps.length} steps completed
                    </p>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      badgeStyle[status] || "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {status}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Page 2: Steps inside selected category */}
        {selectedCategory && (
          <div>
            <button
              onClick={() => {
                setOpenCategory(null);
                setOpenStep(null);
                setOpenResource(null);
                setResourceType(null);
              }}
              className="mb-4 text-sm font-semibold text-violet-700 hover:underline cursor-pointer"
            >
              ← All categories
            </button>

            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              {selectedCategory.id}. {selectedCategory.title}
            </h3>

            <div className="space-y-4">
              {(selectedCategory.steps || []).map((step) => {
                const id = getStepId(step);
                const title = getStepTitle(step);
                const topics = getStepTopics(step);
                const allTopicsCompleted = isStepDone(step);

                const status = getStepStatus(step);
                const locked = status === "Locked" || status === "LOCKED";
                const isOpen = openStep === id;

                return (
                  <div
                    key={id}
                    className={`rounded-2xl bg-white shadow ${
                      locked ? "opacity-60" : ""
                    }`}
                  >
                    <button
                      disabled={locked}
                      onClick={() => setOpenStep(isOpen ? null : id)}
                      className={`w-full p-5 flex items-center justify-between text-left ${
                        locked ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      <h4 className="text-lg font-bold text-slate-800">
                        {locked && "🔒 "}
                        {id}. {title}
                      </h4>

                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                          badgeStyle[status] || "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {status}
                      </span>
                    </button>

                    {/* Topics */}
                    {isOpen && (
                      <div className="px-5 pb-5 space-y-2">
                        {topics.map((topic, index) => {
                          const name = getTopicName(topic);
                          const points = getTopicPoints(topic);
                          const key = getTopicKey(step, topic, index);

                          const done = completed.includes(key);
                          const resourcesOpen = openResource === key;

                          const cacheKey = `${key}-${resourceType}`;
                          const links = resourceType
                            ? resources[cacheKey] || []
                            : [];

                          return (
                            <div
                              key={key}
                              className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="font-bold text-slate-800 text-sm">
                                    {name}
                                  </p>

                                  <p className="text-xs text-slate-600">
                                    {Array.isArray(points)
                                      ? points.join(" · ")
                                      : ""}
                                  </p>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  {/* Resources button */}
                                  <button
                                    onClick={() => {
                                      setOpenResource(
                                        resourcesOpen ? null : key
                                      );
                                      setResourceType(null);
                                      setResourceError("");
                                    }}
                                    className="text-xs font-semibold text-violet-700 hover:underline cursor-pointer"
                                  >
                                    Resources
                                  </button>

                                  {/* Completion checkbox */}
                                  <button
                                    onClick={() => toggleTopic(key)}
                                    title={
                                      done
                                        ? "Mark as not done"
                                        : "Mark as done"
                                    }
                                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-sm font-bold cursor-pointer transition-colors ${
                                      done
                                        ? "border-green-500 bg-green-500 text-white"
                                        : "border-slate-300 bg-white text-transparent hover:border-violet-400"
                                    }`}
                                  >
                                    ✓
                                  </button>
                                </div>
                              </div>

                              {/* Resource panel */}
                              {resourcesOpen && (
                                <div className="mt-2 border-t border-violet-200 pt-2">
                                  <p className="text-xs text-slate-600 mb-2">
                                    What kind of resources do you need?
                                  </p>

                                  <div className="flex flex-wrap gap-2">
                                    {resourceTypes.map(([type, label]) => (
                                      <button
                                        key={type}
                                        onClick={() => {
                                          setResourceType(type);
                                          loadResources(key, type);
                                        }}
                                        className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                                          resourceType === type
                                            ? "bg-violet-600 text-white"
                                            : "bg-white text-violet-700 border border-violet-200 hover:bg-violet-100"
                                        }`}
                                      >
                                        {label}
                                      </button>
                                    ))}
                                  </div>

                                  {resourceType && (
                                    <div className="mt-3">
                                      {resourceLoading === cacheKey && (
                                        <p className="text-sm text-slate-500">
                                          Loading resources...
                                        </p>
                                      )}

                                      {resourceError && (
                                        <p className="text-sm text-red-500">
                                          {resourceError}
                                        </p>
                                      )}

                                      {resourceLoading !== cacheKey &&
                                        !resourceError &&
                                        links.length === 0 &&
                                        resources[cacheKey] && (
                                          <p className="text-sm text-slate-500">
                                            No resources available yet.
                                          </p>
                                        )}

                                      {links.length > 0 && (
                                        <ul className="mt-2 space-y-1 text-sm">
                                          {links.map((link, idx) => (
                                            <li key={link.url || idx}>
                                              <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-violet-700 hover:underline"
                                              >
                                                {link.title} ↗
                                              </a>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Show this step's quiz only after every topic is completed */}
                        {allTopicsCompleted && (
                          <div className="mt-5 flex justify-end border-t border-gray-200 pt-4">
                            <button
                              onClick={() =>
                                navigate("/MilestoneAssessment", {
                                  state: {
                                    stepId: id,
                                    stepTitle: title,
                                    topics: topics.map((topic) => getTopicName(topic)),
                                  },
                                })
                              }
                              className="rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-all cursor-pointer"
                            >
                              Take Quiz →
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
}
