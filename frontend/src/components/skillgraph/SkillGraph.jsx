import { useState, useEffect } from "react";
import { CheckCircle2, Clock, AlertCircle, Lock, ArrowRight, RefreshCw } from "lucide-react";

// Default Track ID seeded in your Java database (V2__tracks.sql: Backend Development)
const DEFAULT_TRACK_ID = "10000000-0000-0000-0000-000000000001";

// Fallback initial data in case the Java backend server is not running yet
const FALLBACK_SKILLS = [
  {
    id: "1",
    name: "Variables and Data Types",
    difficultyLevel: "BEGINNER",
    stage: "Stage 1: Beginner",
    status: "MASTERED",
    score: 95,
    categoryName: "Programming Fundamentals",
    prereq: "None",
    desc: "Understand Java variables, primitive types, type casting, and memory allocation.",
  },
  {
    id: "2",
    name: "Operators and Expressions",
    difficultyLevel: "BEGINNER",
    stage: "Stage 1: Beginner",
    status: "MASTERED",
    score: 85,
    categoryName: "Programming Fundamentals",
    prereq: "Variables and Data Types",
    desc: "Arithmetic, relational, logical, and bitwise operators in Java.",
  },
  {
    id: "3",
    name: "Object-Oriented Programming",
    difficultyLevel: "INTERMEDIATE",
    stage: "Stage 2: Intermediate",
    status: "IN_PROGRESS",
    score: 60,
    categoryName: "Core Java & OOP",
    prereq: "Variables, Operators",
    desc: "Classes, objects, inheritance, polymorphism, encapsulation, and abstraction.",
  },
  {
    id: "4",
    name: "Spring Boot & REST APIs",
    difficultyLevel: "INTERMEDIATE",
    stage: "Stage 2: Intermediate",
    status: "UNLOCKED",
    score: 40,
    categoryName: "Frameworks",
    prereq: "Object-Oriented Programming",
    desc: "Building web controllers, services, dependency injection, and CRUD endpoints.",
  },
  {
    id: "5",
    name: "Database Integration (JPA/Hibernate)",
    difficultyLevel: "ADVANCED",
    stage: "Stage 3: Advanced",
    status: "LOCKED",
    score: 0,
    categoryName: "Databases",
    prereq: "Spring Boot & REST APIs",
    desc: "Entities, repositories, PostgreSQL connections, and transaction management.",
  },
];

const STAGES = ["Stage 1: Beginner", "Stage 2: Intermediate", "Stage 3: Advanced"];

function SkillGraph({ onStartAssessment }) {
  const [skills, setSkills] = useState(FALLBACK_SKILLS);
  const [selectedSkill, setSelectedSkill] = useState(FALLBACK_SKILLS[0]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [isLiveApi, setIsLiveApi] = useState(false);

  // Helper to map difficulty level to our 3 roadmap stages
  function mapToStage(difficulty) {
    if (!difficulty) return "Stage 1: Beginner";
    const upper = difficulty.toUpperCase();
    if (upper === "BEGINNER" || upper === "EASY") return "Stage 1: Beginner";
    if (upper === "INTERMEDIATE" || upper === "MEDIUM") return "Stage 2: Intermediate";
    return "Stage 3: Advanced";
  }

  // Fetch skill graph from Java Spring Boot endpoint
  async function fetchSkillGraph() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // If user is logged in, use personalized progress endpoint; otherwise use track graph endpoint
      const endpoint = token
        ? `/api/progress/tracks/${DEFAULT_TRACK_ID}/graph`
        : `/api/tracks/${DEFAULT_TRACK_ID}/graph`;

      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(endpoint, { headers });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      // Transform backend SkillGraphNodeDTO list to frontend format
      if (data && Array.isArray(data.nodes) && data.nodes.length > 0) {
        const formatted = data.nodes.map((node) => {
          // Mastery score is a decimal 0.0 - 1.0 from backend
          const score =
            node.masteryScore != null ? Math.round(node.masteryScore * 100) : 0;

          // Status from backend can be: MASTERED, IN_PROGRESS, UNLOCKED, LOCKED
          const status = node.status || (score >= 75 ? "MASTERED" : "UNLOCKED");

          return {
            id: node.id,
            name: node.name,
            difficultyLevel: node.difficultyLevel,
            stage: mapToStage(node.difficultyLevel),
            status: status,
            score: score,
            categoryName: node.categoryName || "General",
            prereq:
              node.prerequisiteNames && node.prerequisiteNames.length > 0
                ? node.prerequisiteNames.join(", ")
                : "None",
            desc:
              node.description ||
              `Learn and master ${node.name} for your backend track.`,
          };
        });

        setSkills(formatted);
        setSelectedSkill(formatted[0]);
        setIsLiveApi(true);
      }
    } catch (err) {
      console.log("Could not fetch from live Java backend, using local data:", err.message);
      setIsLiveApi(false);
    } finally {
      setLoading(false);
    }
  }

  // Load the graph when the component mounts
  useEffect(() => {
    fetchSkillGraph();
  }, []);

  // Filter skills by status tab
  const filteredSkills = skills.filter((skill) => {
    if (filter === "All") return true;
    if (filter === "Mastered") return skill.status === "MASTERED";
    if (filter === "In Progress")
      return skill.status === "IN_PROGRESS" || skill.status === "UNLOCKED";
    if (filter === "Locked") return skill.status === "LOCKED";
    return true;
  });

  // Calculate summary counts
  const masteredCount = skills.filter((s) => s.status === "MASTERED").length;
  const inProgressCount = skills.filter(
    (s) => s.status === "IN_PROGRESS" || s.status === "UNLOCKED"
  ).length;
  const lockedCount = skills.filter((s) => s.status === "LOCKED").length;

  const overallProgress =
    skills.length > 0
      ? Math.round(skills.reduce((acc, s) => acc + s.score, 0) / skills.length)
      : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* ---------- HEADER BANNER ---------- */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
              Java Backend Track (DAG)
            </span>
            {isLiveApi ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                ● Live API Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                ○ Demo Mode (Start Java Server to connect)
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            Track: <span className="text-violet-600">Backend Development</span>
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Interactive skill dependency graph mapped from your Spring Boot API.
          </p>
        </div>

        {/* Progress meter and refresh button */}
        <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Track Completion</span>
              <span className="text-violet-600 font-bold">{overallProgress}%</span>
            </div>
            <div className="mt-1 h-2.5 w-36 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-violet-600 transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          {/* Quick counts */}
          <div className="flex gap-3 text-center text-xs">
            <div>
              <p className="font-bold text-emerald-600 text-sm">{masteredCount}</p>
              <p className="text-slate-400">Mastered</p>
            </div>
            <div>
              <p className="font-bold text-amber-500 text-sm">{inProgressCount}</p>
              <p className="text-slate-400">Available</p>
            </div>
            <div>
              <p className="font-bold text-slate-400 text-sm">{lockedCount}</p>
              <p className="text-slate-400">Locked</p>
            </div>
          </div>

          <button
            onClick={fetchSkillGraph}
            title="Reload from backend"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ---------- FILTER CHIPS ---------- */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-600 mr-2">Filter:</span>
        {["All", "Mastered", "In Progress", "Locked"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              filter === tab
                ? "bg-violet-600 text-white"
                : "bg-white text-slate-600 shadow-sm hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ---------- ROADMAP COLUMNS + DETAIL DRAWER ---------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: 3-Stage Roadmap */}
        <div className="lg:col-span-2 flex flex-col gap-6 rounded-2xl bg-white p-6 shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STAGES.map((stageName, stageIdx) => {
              const stageSkills = filteredSkills.filter((s) => s.stage === stageName);

              return (
                <div key={stageName} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold text-slate-700">{stageName}</h3>
                    {stageIdx < STAGES.length - 1 && (
                      <ArrowRight className="hidden md:block h-4 w-4 text-slate-300" />
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    {stageSkills.map((skill) => {
                      const isSelected = selectedSkill?.id === skill.id;

                      return (
                        <div
                          key={skill.id}
                          onClick={() => setSelectedSkill(skill)}
                          className={`cursor-pointer rounded-xl border p-4 transition-all ${
                            isSelected
                              ? "border-violet-600 bg-violet-50/50 shadow-md ring-2 ring-violet-200"
                              : "border-slate-200 bg-white hover:border-violet-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">
                              {skill.name}
                            </h4>
                            <BackendStatusBadge status={skill.status} />
                          </div>

                          <span className="text-[10px] text-slate-400 font-medium">
                            {skill.categoryName}
                          </span>

                          <div className="mt-3">
                            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                              <span>Mastery</span>
                              <span className="font-semibold text-slate-700">
                                {skill.score}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full ${
                                  skill.status === "MASTERED"
                                    ? "bg-emerald-500"
                                    : skill.status === "LOCKED"
                                    ? "bg-slate-300"
                                    : "bg-violet-600"
                                }`}
                                style={{ width: `${skill.score}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {stageSkills.length === 0 && (
                      <p className="p-4 text-center text-xs text-slate-400 italic">
                        No skills in this stage.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Skill Detail Box */}
        <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow">
          {selectedSkill ? (
            <div className="flex flex-col gap-4">
              <div>
                <div className="mb-2">
                  <BackendStatusBadge status={selectedSkill.status} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">{selectedSkill.name}</h3>
                <p className="mt-1 text-xs text-violet-600 font-semibold">
                  {selectedSkill.categoryName} • {selectedSkill.stage}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5">
                <p className="text-xs font-semibold text-slate-500">Skill Overview</p>
                <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                  {selectedSkill.desc}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Prerequisites (From DAG)
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700 bg-slate-100 inline-block px-3 py-1 rounded-lg">
                  {selectedSkill.prereq}
                </p>
              </div>

              <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-3.5">
                <p className="text-xs font-semibold text-violet-700 uppercase tracking-wider">
                  Current Status
                </p>
                <p className="mt-1 text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedSkill.status === "MASTERED" &&
                    "Great job! You have demonstrated proficiency in this skill."}
                  {selectedSkill.status === "UNLOCKED" &&
                    "Prerequisites completed! This skill is ready for you to study and test."}
                  {selectedSkill.status === "IN_PROGRESS" &&
                    "You are actively working on this skill."}
                  {selectedSkill.status === "LOCKED" &&
                    "Complete the prerequisite skills above to unlock this assessment."}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center my-auto">
              Select any skill card from the graph to inspect it.
            </p>
          )}

          {/* Action button */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <button
              onClick={() => onStartAssessment?.(selectedSkill?.name)}
              disabled={selectedSkill?.status === "LOCKED"}
              className={`w-full rounded-full py-2.5 text-sm font-semibold text-white transition-colors shadow-sm ${
                selectedSkill?.status === "LOCKED"
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-violet-600 hover:bg-violet-700"
              }`}
            >
              {selectedSkill?.status === "LOCKED"
                ? "Locked (Prerequisites Needed)"
                : `Take IRT Test for ${selectedSkill?.name || "Skill"}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Maps backend DTO statuses (MASTERED, UNLOCKED, IN_PROGRESS, LOCKED) to UI badges
function BackendStatusBadge({ status }) {
  if (status === "MASTERED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="h-3 w-3" />
        Mastered
      </span>
    );
  }

  if (status === "IN_PROGRESS" || status === "UNLOCKED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet-700 border border-violet-200">
        <Clock className="h-3 w-3" />
        {status === "IN_PROGRESS" ? "In Progress" : "Unlocked"}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200">
      <Lock className="h-3 w-3" />
      Locked
    </span>
  );
}

export default SkillGraph;
