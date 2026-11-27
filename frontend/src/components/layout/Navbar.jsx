import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/octobyte-logo.jpeg";
import { isAuthenticated, getCurrentUser, clearAuthSession } from "../../api/auth";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Take IRT Test", path: "/assessment" },
  { label: "View Skill Graph", path: "/skills" },
  { label: "Roadmap", path: "/roadmap" },
  { label: "Profile", path: "/profile" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
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
    <header className="sticky top-0 z-50 flex shrink-0 items-center justify-between bg-white px-8 py-4 shadow-sm border-b border-slate-100">
      <div
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-3 select-none cursor-pointer"
      >
        <img
          src={logo}
          alt="OctoByte Logo"
          className="h-12 w-auto object-contain"
        />
      </div>

      <nav className="flex gap-8">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={
                isActive
                  ? "border-b-2 border-violet-600 pb-1 font-semibold text-violet-600"
                  : "pb-1 font-medium text-slate-600 hover:text-violet-600 transition-colors"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        {loggedIn && currentUser?.fullName && (
          <span className="text-sm font-medium text-slate-600">
            Hi, {currentUser.fullName}
          </span>
        )}
        <button
          onClick={handleAuthClick}
          className="rounded-full bg-violet-600 px-5 py-2 font-semibold text-white hover:bg-violet-700 transition-colors cursor-pointer"
        >
          {loggedIn ? "Sign Out" : "Sign In"}
        </button>
      </div>
    </header>
  );
}
