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

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Invalid credentials. Please try again.");
        return;
      }

      // Store JWT token and user info
      setAuthSession(data.accessToken, data.user);
      setSuccess(true);

      // Automatically navigate to dashboard
      navigate("/dashboard");
    } catch (e) {
      setError("Something went wrong. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white text-black p-8 rounded-xl border border-gray-200">
        {success ? (
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-3">Login successful</h1>
            <p className="text-sm text-gray-500 mb-6">Welcome back!</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md text-sm font-medium transition-colors cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>

            <p className="text-sm text-gray-500 mt-2 mb-6">Welcome back! Enter your details.</p>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-3 mb-4 border border-gray-200 rounded-md text-sm outline-none focus:border-purple-500 transition-colors"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-3 mb-4 border border-gray-200 rounded-md text-sm outline-none focus:border-purple-500 transition-colors"
            />

            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-md text-sm font-medium transition-colors cursor-pointer"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-sm text-gray-500 text-center mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-purple-600 hover:text-purple-700 underline">
                Sign Up
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;