import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../api/auth";
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

export default function Profile() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top bar */}
      <header className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">
        <OctoByteLogo/>
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-full bg-violet-600 px-5 py-2 font-semibold text-white hover:bg-violet-700 cursor-pointer"
        >
          Back to Dashboard
        </button>
      </header>

      {/* Profile details */}
      <main className="mx-auto max-w-xl p-8">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">User Profile</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Name</p>
              <p className="text-lg font-medium text-slate-800">{user?.fullName || user?.name || "Learner"}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Email</p>
              <p className="text-lg font-medium text-slate-800">{user?.email || "learner@example.com"}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Track</p>
              <p className="text-lg font-medium text-slate-800">Backend Development</p>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => navigate("/roadmap")}
              className="rounded-full bg-violet-600 px-6 py-2.5 font-semibold text-white hover:bg-violet-700 cursor-pointer"
            >
              View My Roadmap
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-full border border-slate-300 px-6 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
