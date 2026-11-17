import { useNavigate } from "react-router-dom";

export default function Roadmap() {
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: "Step 1: Programming Fundamentals", desc: "Variables, Data Types, and Operators", status: "Completed" },
    { id: 2, title: "Step 2: Object-Oriented Programming", desc: "Classes, Objects, Inheritance, and Polymorphism", status: "In Progress" },
    { id: 3, title: "Step 3: Spring Boot & REST APIs", desc: "Build RESTful Web Services and Controllers", status: "Upcoming" },
    { id: 4, title: "Step 4: Database & SQL", desc: "PostgreSQL, JPA, and Transactions", status: "Upcoming" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top bar */}
      <header className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-violet-600">octoByte</h1>
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
      <main className="mx-auto max-w-3xl p-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Learning Roadmap</h2>
        <p className="text-slate-600 mb-6">Your customized path to master backend development.</p>

        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="rounded-2xl bg-white p-5 shadow flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                  step.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : step.status === "In Progress"
                    ? "bg-violet-100 text-violet-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {step.status}
              </span>
            </div>
          ))}
        </div>

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
