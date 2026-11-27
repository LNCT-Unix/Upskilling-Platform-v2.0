import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import { getAuthToken, clearAuthSession } from "../../api/auth";
import logo from "../../assets/octobyte-logo.jpeg";

export default function MilestoneAssessment() {
  const { skillId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const startedSkillRef = useRef(null);
  const inFlightRef = useRef(false);

  const apiFetch = useCallback(async (path, options = {}) => {
    const token = getAuthToken();
    if (!token) {
      clearAuthSession();
      navigate("/login");
      return null;
    }

    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (res.status === 401) {
      clearAuthSession();
      navigate("/login");
      return null;
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || data.error || `Request failed (${res.status})`);
    }
    return data;
  }, [navigate]);

  const startAssessment = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setLoading(true);
    setError("");
    setResult(null);
    setIndex(0);

    try {
      const started = await apiFetch("/milestones/start", {
        method: "POST",
        body: JSON.stringify({ skillId }),
      });
      if (!started) return;

      const details = await apiFetch(`/milestones/${started.attemptId}`);
      if (!details) return;

      setAttempt(started);
      setQuestions(details.questions || []);
    } catch (err) {
      setError(err.message || "Could not start milestone assessment.");
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [apiFetch, skillId]);

  useEffect(() => {
    if (startedSkillRef.current === skillId) return;
    startedSkillRef.current = skillId;
    startAssessment();
  }, [skillId, startAssessment]);

  async function handleSelect(questionId, optionKey) {
    if (!attempt || submitting) return;
    const prevAnswer = questions[index]?.selectedAnswer ?? null;
    setError("");
    setQuestions((prev) =>
      prev.map((q) => (q.questionId === questionId ? { ...q, selectedAnswer: optionKey } : q))
    );

    try {
      await apiFetch(`/milestones/${attempt.attemptId}/answers/${questionId}`, {
        method: "PATCH",
        body: JSON.stringify({ selectedAnswer: optionKey }),
      });
    } catch (err) {
      setQuestions((prev) =>
        prev.map((q) => (q.questionId === questionId ? { ...q, selectedAnswer: prevAnswer } : q))
      );
      setError(err.message || "Failed to save answer.");
    }
  }

  async function handleSubmit() {
    if (!attempt || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const data = await apiFetch(`/milestones/${attempt.attemptId}/submit`, { method: "POST" });
      if (data) setResult(data);
    } catch (err) {
      setError(err.message || "Failed to submit assessment.");
    } finally {
      setSubmitting(false);
    }
  }

  const current = questions[index];
  const answeredCount = questions.filter((q) => q.selectedAnswer).length;
  const card = "bg-white rounded-2xl border border-purple-100 shadow-sm p-8 space-y-6";
  const primaryBtn = "px-6 py-2.5 rounded-full bg-[#7056ED] hover:bg-[#5f44e2] text-white font-semibold text-sm cursor-pointer disabled:opacity-50";

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-800 flex flex-col">
      <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between">
        <img src={logo} alt="OctoByte Logo" onClick={() => navigate("/dashboard")} className="h-10 cursor-pointer" />
        <button onClick={() => navigate("/roadmap")} className="text-sm font-semibold text-slate-600 hover:text-[#7056ED] cursor-pointer">
          Back to Roadmap
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {loading && (
            <div className={`${card} text-center`}>
              <p className="text-base font-semibold text-[#7056ED]">Starting assessment...</p>
            </div>
          )}

          {!loading && error && !questions.length && (
            <div className={`${card} text-center`}>
              <p className="text-red-500 font-semibold">{error}</p>
              <div className="flex justify-center gap-3">
                <button onClick={startAssessment} className={primaryBtn}>Retry</button>
                <button onClick={() => navigate("/roadmap")} className="px-6 py-2.5 rounded-full bg-slate-100 font-semibold text-sm cursor-pointer hover:bg-slate-200">
                  Back to Roadmap
                </button>
              </div>
            </div>
          )}

          {!loading && result && (
            <div className={`${card} text-center`}>
              <span className={`inline-block rounded-full px-3.5 py-1 text-xs font-bold ${result.passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                {result.passed
                  ? "Passed — Skill Unlocked"
                  : `Not Passed (${Math.ceil((result.totalQuestions || 8) * 0.75)}/${result.totalQuestions || 8} required)`}
              </span>
              <h1 className="text-2xl font-extrabold">{attempt?.skillName || "Milestone Assessment"}</h1>
              <div className="text-5xl font-black text-[#7056ED]">{result.score} / {result.totalQuestions}</div>
              <p className="text-slate-600 text-sm">
                Correct: {result.correctAnswers} · Incorrect: {result.incorrectAnswers} ({result.totalQuestions ? Math.round((result.score / result.totalQuestions) * 100) : 0}%)
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button onClick={() => navigate("/roadmap")} className={primaryBtn}>Back to Roadmap</button>
                <button onClick={startAssessment} className="px-6 py-2.5 rounded-full bg-purple-50 text-[#7056ED] font-semibold text-sm cursor-pointer hover:bg-purple-100">
                  Retake Test
                </button>
                <button onClick={() => navigate("/skills")} className="px-6 py-2.5 rounded-full bg-slate-100 font-semibold text-sm cursor-pointer hover:bg-slate-200">
                  Skill Graph
                </button>
              </div>
            </div>
          )}

          {!loading && !result && current && (
            <div className={card}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="inline-block rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#7056ED]">
                    {attempt?.skillName || skillId} · Attempt #{attempt?.attemptNumber || 1}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-500">
                  Question {index + 1} of {questions.length} ({answeredCount}/{questions.length} answered)
                </span>
              </div>

              <div className="flex gap-2">
                {questions.map((q, i) => (
                  <button
                    key={q.questionId}
                    onClick={() => setIndex(i)}
                    className={`flex-1 h-8 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      i === index
                        ? "bg-[#7056ED] text-white"
                        : q.selectedAnswer
                        ? "bg-purple-100 text-[#7056ED]"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <h2 className="text-xl font-bold text-slate-900">{current.questionText}</h2>

              <div className="space-y-3">
                {Object.entries(current.options || {})
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([key, text]) => {
                  const isSelected = current.selectedAnswer === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelect(current.questionId, key)}
                      className={`w-full text-left p-4 rounded-xl border cursor-pointer transition-colors ${
                        isSelected
                          ? "border-[#7056ED] bg-purple-50 text-slate-900"
                          : "border-slate-200 hover:border-[#7056ED]"
                      }`}
                    >
                      <b>{key}.</b> {text}
                    </button>
                  );
                })}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={index === 0}
                  onClick={() => setIndex((i) => i - 1)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm cursor-pointer hover:bg-slate-200 disabled:opacity-40"
                >
                  Previous
                </button>

                <div className="flex gap-3">
                  {index < questions.length - 1 ? (
                    <button onClick={() => setIndex((i) => i + 1)} className={primaryBtn}>
                      Next
                    </button>
                  ) : (
                    <button onClick={handleSubmit} disabled={submitting} className={primaryBtn}>
                      {submitting ? "Submitting..." : "Submit Assessment"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
