
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import { setAuthSession } from "../../api/auth";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Remove trailing slash from API URL
  const API_ROOT = API_BASE_URL.replace(/\/+$/, "");

  // Email and password login
  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_ROOT}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          data.message || "Invalid credentials. Please try again."
        );
        return;
      }

      // Store JWT token and user information
      setAuthSession(data.accessToken, data.user);

      setSuccess(true);
      navigate("/dashboard");

    } catch (error) {
      setError(
        "Something went wrong. Please check your network and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // GitHub OAuth login
  function handleGithubLogin() {
    setError("");

    // Convert API base URL into backend origin
    const backendOrigin = API_ROOT.replace(/\/api\/?$/, "");

    // Redirect browser to Spring Boot GitHub OAuth endpoint
    window.location.href =
      `${backendOrigin}/oauth2/authorization/github`;
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">

      <div className="w-full max-w-sm bg-white text-black p-8 rounded-xl border border-gray-200">

        {success ? (
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-3">
              Login successful
            </h1>

            <p className="text-sm text-gray-500 mb-6">
              Welcome back!
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md text-sm font-medium"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div>

            <form onSubmit={handleLogin}>

              <h1 className="text-2xl font-semibold tracking-tight">
                Login
              </h1>

              <p className="text-sm text-gray-500 mt-2 mb-6">
                Welcome back! Enter your details.
              </p>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-3 mb-4 border border-gray-200 rounded-md text-sm outline-none focus:border-purple-500"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-3 mb-4 border border-gray-200 rounded-md text-sm outline-none focus:border-purple-500"
              />

              {error && (
                <p className="text-sm text-red-500 mb-4">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-md text-sm font-medium transition-colors cursor-pointer"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-xs text-gray-400 uppercase">
                or
              </span>
              <div className="border-t border-gray-200 w-full" />
            </div>

            {/* GitHub OAuth Button */}
            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-md text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>

              Continue with GitHub
            </button>

            <p className="text-sm text-gray-500 text-center mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-600 hover:text-purple-700 underline"
              >
                Sign Up
              </Link>
            </p>

          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
