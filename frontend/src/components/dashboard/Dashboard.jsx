import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SkillGraph from "../skillgraph/SkillGraph";
import { clearAuthSession, isAuthenticated, getCurrentUser } from "../../api/auth";

// The items shown on the top bar
const NAV_ITEMS = ["Dashboard", "Take IRT Test", "View Skill Graph"];

function Dashboard() {
  const navigate = useNavigate();
  // Which page is open right now
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Starts at 0. Update it with setLastScore(...) when you get real data.
  const [lastScore, setLastScore] = useState(0);

  // Becomes true after the first test is finished (set it from your backend later)
  const [hasTakenTest, setHasTakenTest] = useState(false);

  const loggedIn = isAuthenticated();
  const currentUser = getCurrentUser();

  function handleAuthClick() {
    if (loggedIn) {
      clearAuthSession();
      navigate("/login");
    } else {
      navigate("/login");
    }
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50 text-slate-900">
      {/* ---------- TOP BAR ---------- */}
      <header className="flex shrink-0 items-center justify-between bg-white px-8 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-violet-600">octoByte</h1>

        <nav className="flex gap-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={
                activeTab === item
                  ? "border-b-2 border-violet-600 pb-1 font-semibold text-violet-600 cursor-pointer"
                  : "pb-1 font-medium text-slate-600 hover:text-violet-600 cursor-pointer"
              }
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {loggedIn && currentUser?.fullName && (
            <span className="text-sm font-medium text-slate-600">
              Hi, {currentUser.fullName}
            </span>
          )}
          <button
            onClick={handleAuthClick}
            className="rounded-full bg-violet-600 px-5 py-2 font-semibold text-white hover:bg-violet-700 cursor-pointer"
          >
            {loggedIn ? "Sign Out" : "Sign In"}
          </button>
        </div>
      </header>

      {/* ---------- PAGE CONTENT ---------- */}
      <main className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col overflow-y-auto px-6 py-6">
        {activeTab === "Dashboard" && (
          <Home
            lastScore={lastScore}
            hasTakenTest={hasTakenTest}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "Take IRT Test" && <Page title="Take IRT Test" text="Your test questions will show up here." />}
        {activeTab === "View Skill Graph" && (
          <SkillGraph onStartAssessment={() => setActiveTab("Take IRT Test")} />
        )}
        {activeTab === "Test Report" && <Page title="Test Report" text="Your test report will show up here." />}
        {activeTab === "Roadmap" && <Page title="Roadmap Path" text="Your roadmap will show up here." />}
      </main>
    </div>
  );
}

// One reusable block, so all 4 blocks look the same size and style
function Card({ title, children }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow">
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      {children}
    </div>
  );
}

// Home screen: 4 cards in one row
function Home({ lastScore, hasTakenTest, setActiveTab }) {
  return (
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
            onClick={() => setActiveTab("Take IRT Test")}
            className="rounded-full bg-violet-600 py-2 font-semibold text-white hover:bg-violet-700"
          >
            Start assessment
          </button>
        </Card>

        {/* Card 3: test report */}
        <Card title="Test report">
          <p className="text-slate-600">
            See where you did well and where you need work.
          </p>
          <button
            onClick={() => setActiveTab("Test Report")}
            disabled={!hasTakenTest}
            className="rounded-full border border-violet-600 py-2 font-semibold text-violet-600 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            View test report
          </button>
        </Card>

        {/* Card 4: roadmap */}
        <Card title="Roadmap path">
          <p className="text-slate-600">
            Your step-by-step plan to close your skill gaps.
          </p>
          <button
            onClick={() => setActiveTab("Roadmap")}
            disabled={!hasTakenTest}
            className="rounded-full border border-violet-600 py-2 font-semibold text-violet-600 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            View roadmap path
          </button>
        </Card>
      </div>

      {!hasTakenTest && (
        <p className="mt-3 text-sm text-slate-500">
          The report and roadmap unlock after you finish your first assessment.
        </p>
      )}
    </div>
  );
}

// Simple placeholder page. Replace the text with your real content later.
function Page({ title, text }) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-slate-600">{text}</p>
    </div>
  );
}

export default Dashboard;
