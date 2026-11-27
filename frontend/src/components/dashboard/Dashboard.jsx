import { useState } from "react";
import { useNavigate } from "react-router-dom";

// One reusable block, so all 4 blocks look the same size and style
function Card({ title, children }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow">
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  // Starts at 0. Update it with setLastScore(...) when you get real data.
  const [lastScore] = useState(0);

  // Becomes true after the first test is finished
  const [hasTakenTest] = useState(
    localStorage.getItem("assessment_completed") === "true"
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-8">
      <div className="flex flex-col">
        <h2 className="mb-4 text-3xl font-bold">Your dashboard</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: last score */}
          <Card title="Last test score">
            <p className="text-6xl font-bold text-violet-600">{lastScore}</p>
          </Card>

          {/* Card 2: start assessment */}
          <Card title="Assessment">
            <p className="text-slate-600">
              Take the IRT test to find your skill gaps.
            </p>
            <button
              onClick={() => navigate("/assessment")}
              className="rounded-full bg-violet-600 py-2 font-semibold text-white hover:bg-violet-700 cursor-pointer"
            >
              Start assessment
            </button>
          </Card>

          {/* Card 3: skill graph */}
          <Card title="Skill Graph">
            <p className="text-slate-600">
              Explore your interactive prerequisite skill tree.
            </p>
            <button
              onClick={() => navigate("/skills")}
              className="rounded-full border border-violet-600 py-2 font-semibold text-violet-600 hover:bg-violet-50 cursor-pointer"
            >
              View skill graph
            </button>
          </Card>

          {/* Card 4: roadmap */}
          <Card title="Roadmap path">
            <p className="text-slate-600">
              Your step-by-step plan to close your skill gaps.
            </p>
            <button
              onClick={() => navigate("/roadmap")}
              className="rounded-full bg-violet-600 py-2 font-semibold text-white hover:bg-violet-700 cursor-pointer"
            >
              View roadmap path
            </button>
          </Card>
        </div>

        {!hasTakenTest && (
          <p className="mt-3 text-sm text-slate-500">
            The roadmap and assessment results unlock after you finish your first assessment.
          </p>
        )}
      </div>
    </div>
  );
}
