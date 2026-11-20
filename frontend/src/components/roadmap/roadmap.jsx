import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "./roadmapData";
import logo from '../../assets/octobyte-logo.jpeg';

function OctoByteLogo() {
  return (
    <div className="flex items-center gap-3 select-none cursor-pointer">
      <img
        src={logo}
        alt="OctoByte Logo"
        className="h-12 w-auto object-contain"
      />
    </div>
  );
}

const STORAGE_KEY = "roadmapCompletedTopics";

// Resources for one topic. Empty for now; add items here later.
function getResources() {
  return { videos: [], docs: [], courses: [] };
}

const resourceTypes = [
  ["videos", "▶ Video lectures"],
  ["docs", "📄 Docs"],
  ["courses", "🎓 Courses"],
];

const badgeStyle = {
  Completed: "bg-green-100 text-green-700",
  "In Progress": "bg-violet-100 text-violet-700",
  Locked: "bg-slate-100 text-slate-500",
};

export default function Roadmap() {
  const navigate = useNavigate();

  // Completed topics, stored as "stepId-topicIndex" (e.g. "1-0" = Primitives).
  // Kept in localStorage for now; backend can replace this later.
  const [completed, setCompleted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [openCategory, setOpenCategory] = useState(null); // category id
  const [openStep, setOpenStep] = useState(null); // step id
  const [openResource, setOpenResource] = useState(null); // topic key whose Resources panel is open
  const [resourceType, setResourceType] = useState(null); // "videos" | "docs" | "courses"

  // A step is completed when all of its topics are ticked.
  const isStepDone = ([id, , topics]) =>
    topics.every((_, i) => completed.includes(`${id}-${i}`));

  // Steps are in order across all categories. Step N unlocks when step N-1 is done.
  const allSteps = categories.flatMap((c) => c.steps);
  const isStepUnlocked = (id) => id === 1 || isStepDone(allSteps[id - 2]);

  const getCategoryStatus = (cat) => {
    if (cat.steps.every(isStepDone)) return "Completed";
    if (isStepUnlocked(cat.steps[0][0])) return "In Progress";
    return "Locked";
  };

  const getStepStatus = (step) => {
    if (isStepDone(step)) return "Completed";
    return isStepUnlocked(step[0]) ? "In Progress" : "Locked";
  };

  // Tick / untick one topic
  const toggleTopic = (key) => {
    const updated = completed.includes(key)
      ? completed.filter((k) => k !== key)
      : [...completed, key];
    setCompleted(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const category = categories.find((c) => c.id === openCategory);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top bar */}
      <header className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">
        <OctoByteLogo/>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-full bg-violet-600 px-5 py-2 font-semibold text-white hover:bg-violet-700 cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Roadmap Content */}
      <main className="mx-auto max-w-4xl p-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Learning Roadmap</h2>
        <p className="text-slate-600 mb-6">Your customized path to master backend development.</p>

        {/* Page 1: 6 main categories */}
        {!category && (
          <div className="space-y-4">
            {categories.map((cat) => {
              const status = getCategoryStatus(cat);
              const locked = status === "Locked";
              const done = cat.steps.filter(isStepDone).length;
              return (
                <button
                  key={cat.id}
                  disabled={locked}
                  onClick={() => setOpenCategory(cat.id)}
                  className={`w-full rounded-2xl bg-white p-5 shadow flex items-center justify-between text-left ${
                    locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:shadow-md"
                  }`}
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {locked && "🔒 "}
                      {cat.id}. {cat.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {done} of {cat.steps.length} steps completed
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${badgeStyle[status]}`}>
                    {status}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Page 2: steps inside the selected category */}
        {category && (
          <div>
            <button
              onClick={() => { setOpenCategory(null); setOpenStep(null); }}
              className="mb-4 text-sm font-semibold text-violet-700 hover:underline cursor-pointer"
            >
              ← All categories
            </button>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              {category.id}. {category.title}
            </h3>

            <div className="space-y-4">
              {category.steps.map((step) => {
                const [id, title, topics] = step;
                const status = getStepStatus(step);
                const locked = status === "Locked";
                const isOpen = openStep === id;
                return (
                  <div key={id} className={`rounded-2xl bg-white shadow ${locked ? "opacity-60" : ""}`}>
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
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${badgeStyle[status]}`}>
                        {status}
                      </span>
                    </button>

                    {/* Topics of this step: one compact row each, with a tick when completed */}
                    {isOpen && (
                      <div className="px-5 pb-5 space-y-2">
                        {topics.map(([name, points], i) => {
                          const key = `${id}-${i}`;
                          const done = completed.includes(key);
                          const resourcesOpen = openResource === key;
                          const links = resourcesOpen && resourceType ? getResources(category, name)[resourceType] : [];
                          return (
                            <div key={key} className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="font-bold text-slate-800 text-sm">{name}</p>
                                  <p className="text-xs text-slate-600">{points.join(" · ")}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  <button
                                    onClick={() => {
                                      setOpenResource(resourcesOpen ? null : key);
                                      setResourceType(null);
                                    }}
                                    className="text-xs font-semibold text-violet-700 hover:underline cursor-pointer"
                                  >
                                    Resources
                                  </button>
                                  <button
                                    onClick={() => toggleTopic(key)}
                                    title={done ? "Mark as not done" : "Mark as done"}
                                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-sm font-bold cursor-pointer ${
                                      done
                                        ? "border-green-500 bg-green-500 text-white"
                                        : "border-slate-300 bg-white text-transparent hover:border-violet-400"
                                    }`}
                                  >
                                    ✓
                                  </button>
                                </div>
                              </div>

                              {/* Resources: first ask what the user wants, then show links */}
                              {resourcesOpen && (
                                <div className="mt-2 border-t border-violet-200 pt-2">
                                  <p className="text-xs text-slate-600 mb-2">What kind of resources do you need?</p>
                                  <div className="flex flex-wrap gap-2">
                                    {resourceTypes.map(([type, label]) => (
                                      <button
                                        key={type}
                                        onClick={() => setResourceType(type)}
                                        className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer ${
                                          resourceType === type
                                            ? "bg-violet-600 text-white"
                                            : "bg-white text-violet-700 border border-violet-200 hover:bg-violet-100"
                                        }`}
                                      >
                                        {label}
                                      </button>
                                    ))}
                                  </div>
                                  {links.length > 0 && (
                                    <ul className="mt-2 space-y-1 text-sm">
                                      {links.map((l) => (
                                        <li key={l.url}>
                                          <a
                                            href={l.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-violet-700 hover:underline"
                                          >
                                            {l.title} ↗
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={() => navigate("/assessment")}
            className="rounded-full bg-violet-600 px-6 py-2.5 font-semibold text-white hover:bg-violet-700 cursor-pointer"
          >
            Take Assessment
          </button>
        </div>
      </main>
    </div>
  );
}
