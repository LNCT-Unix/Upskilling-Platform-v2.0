
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_BASE_URL } from "../../api/config";
import { setAuthSession } from "../../api/auth";

function OAuthCallback() {
  const navigate = useNavigate();

  const [error, setError] = useState("");

  // Prevent duplicate exchange requests in React StrictMode
  const requestStarted = useRef(false);

  useEffect(() => {
    if (requestStarted.current) return;

    requestStarted.current = true;

    async function exchangeCode() {
      try {
        // 1. Extract temporary code from callback URL
        const params = new URLSearchParams(
          window.location.search
        );

        const code = params.get("code");
        const oauthError = params.get("error");

        if (oauthError) {
          throw new Error(
            params.get("error_description") ||
            "GitHub authentication was cancelled or failed."
          );
        }

        if (!code) {
          throw new Error("Authorization code not found.");
        }

        // 2. Send code to backend
        const API_ROOT = API_BASE_URL.replace(/\/+$/, "");

        const response = await fetch(
          `${API_ROOT}/auth/oauth2/exchange`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            // Include cookies in the request
            credentials: "include",

            body: JSON.stringify({
              code: code,
            }),
          }
        );

        // 3. Read backend response
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message || "GitHub login failed."
          );
        }

        // 4. Validate response
        if (!data.accessToken || !data.user) {
          throw new Error(
            "Invalid authentication response from server."
          );
        }

        // 5. Update authentication state
        setAuthSession(data.accessToken, data.user);

        // 6. Remove code from browser URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        // 7. Redirect to dashboard
        navigate("/dashboard", { replace: true });

      } catch (err) {
        console.error("OAuth Error:", err);

        setError(
          err.message || "Unable to complete GitHub login."
        );
      }
    }

    exchangeCode();

  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">

      <div className="bg-white text-black p-8 rounded-xl max-w-sm w-full text-center">

        {error ? (
          <>
            <h1 className="text-xl font-semibold text-red-600 mb-3">
              Login Failed
            </h1>

            <p className="text-sm text-gray-600 mb-6">
              {error}
            </p>

            <button
              onClick={() => navigate("/login", { replace: true })}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent mx-auto mb-5" />

            <h1 className="text-xl font-semibold mb-2">
              Completing GitHub Login
            </h1>

            <p className="text-sm text-gray-500">
              Please wait while we authenticate your account...
            </p>
          </>
        )}

      </div>
    </div>
  );
}

export default OAuthCallback;
