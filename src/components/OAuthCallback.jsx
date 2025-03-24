import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { oauthLoginSuccess } from "../features/auth/authSlice";

export default function OAuthCallback() {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function handleOAuthCallback() {
      try {
        const params = new URLSearchParams(location.search);
        const userJson = params.get("user");
        const provider = params.get("provider");

        if (!userJson) {
          setError("Authentication failed. User data not received.");
          return;
        }

        let user;

        try {
          user = userJson ? JSON.parse(decodeURIComponent(userJson)) : null;

          if (user && provider && !user.provider) {
            user.provider = provider;
          }
        } catch (error) {
          console.error("Error parsing user data:", e);
          setError("Error processing user data.");
          return;
        }

        dispatch(oauthLoginSuccess(user));

        navigate("/");
      } catch (error) {
        console.error("OAuth callback error:", err);
        setError("Authentication failed. Please try again.");
      }
    }

    handleOAuthCallback();
  }, [dispatch, location, navigate]);

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
        <div className="text-center mt-3">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Return to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Completing Authentication</h2>
      <p>Please wait while we complete the authentication process...</p>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
