import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName: name, email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Registration failed. Please check your details.");
        return;
      }

      setSuccess(true);
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
            <h1 className="text-2xl font-semibold mb-3">Signup successful</h1>
            <p className="text-sm text-gray-500 mb-6">Your account has been successfully created.</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md text-sm font-medium transition-colors"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSignup}>
            <h1 className="text-2xl font-semibold tracking-tight">Create Account</h1>
            <p className="text-sm text-gray-500 mt-2 mb-6">Enter your details to get started.</p>

            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-3 mb-4 border border-gray-200 rounded-md text-sm outline-none focus:border-purple-500 transition-colors"
            />

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-3 mb-4 border border-gray-200 rounded-md text-sm outline-none focus:border-purple-500 transition-colors"
            />

            <input
              type="password"
              placeholder="Enter password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-3 mb-4 border border-gray-200 rounded-md text-sm outline-none focus:border-purple-500 transition-colors"
            />

            {error && (
              <p className="text-sm text-red-500 mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-md text-sm font-medium transition-colors cursor-pointer"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            <p className="text-sm text-gray-500 text-center mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 underline">
                Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Signup;
