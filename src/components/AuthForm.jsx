import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  clearError,
  loginUser,
  registerUser,
  resetMfaState,
  verifyMfaLogin,
} from "../features/auth/authSlice";
import { getGithubAuthUrl, getGoogleAuthUrl } from "../services/authService";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import MfaForm from "./MfaForm";

export default function AuthForm({ isLogin = true }) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState(null);
  const [mfaCode, setMfaCode] = useState("");

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, mfaRequired, rateLimitExceeded } =
    useSelector((state) => state.auth);

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, isLogin]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }

    return () => {
      if (mfaRequired) {
        dispatch(resetMfaState());
      }
    };
  }, [isAuthenticated, navigate, dispatch, mfaRequired]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setFormError("");
  }

  function handlePasswordFeedback(feedback) {
    setPasswordFeedback(feedback);
  }

  function validateForm() {
    if (isLogin) {
      if (!formData.username || !formData.password) {
        setFormError("Please fill in all the required fields");
        return false;
      }
    } else {
      if (
        !formData.username ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.email ||
        !formData.name
      ) {
        setFormError("Please fill in all the required fields");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setFormError("Passwords do not match");
        return false;
      }

      if (passwordFeedback && !passwordFeedback.valid) {
        setFormData(passwordFeedback.message);
        return false;
      }
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) {
      return;
    }

    try {
      if (isLogin) {
        await dispatch(
          loginUser({
            username: formData.username,
            password: formData.password,
          })
        ).unwrap();
      } else {
        await dispatch(
          registerUser({
            name: formData.name,
            username: formData.username,
            password: formData.password,
            email: formData.email,
          })
        ).unwrap();

        navigate("/login", {
          state: {
            message: formData.email
              ? "Registration successful! Please check your email to verify your account."
              : "Registration successful! You can now log in.",
          },
        });
      }
    } catch (error) {
      console.log("Auth error", error);
    }
  }

  async function handleMfaSubmit(code) {
    try {
      await dispatch(
        verifyMfaLogin({
          username: formData.username,
          password: formData.password,
          mfaToken: code,
        })
      ).unwrap();
    } catch (error) {
      console.log("Mfa error", error);
    }
  }

  async function handleOAuthLogin(provider) {
    if (provider === "google") {
      window.location.href = getGoogleAuthUrl();
    } else if (provider === "github") {
      window.location.href = getGithubAuthUrl();
    }
  }

  if (isLogin && mfaRequired) {
    return (
      <div className="card shadow-sm border-0 p-4">
        <MfaForm onSubmit={handleMfaSubmit} loading={loading} />
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0 p-4">
      <h3 className="text-center mb-4">
        {isLogin ? "Login" : "Create Account"}
      </h3>

      {successMessage && (
        <div className="alert alert-success mb-4">{successMessage}</div>
      )}

      {rateLimitExceeded && (
        <div className="alert alert-warning mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Too many login attempts. Please try again later or reset your
          password.
        </div>
      )}

      {(formError || error) && (
        <div className="alert alert-danger">{formError || error}</div>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required={!isLogin}
            />
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {!isLogin && (
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Name {isLogin ? "" : "(recommended for account recovery)"}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
            {!isLogin && (
              <div className="form-text">
                Adding an email enables password recovery and allows you to
                enable two-factor authentication.
              </div>
            )}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {!isLogin && (
            <PasswordStrengthMeter 
              password={formData.password} 
              userInfo={{
                username: formData.username,
                email: formData.email,
                name: formData.name
              }}
              onFeedback={handlePasswordFeedback}
            />
          )}
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            className="form-control"
            value={formData.confirmPassword}
            onChange={handleChange}
            required={!isLogin}
          />
        </div>

        <div className="d-grid gap-3 mb-3">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                {isLogin ? "Logging in..." : "Creating account..."}
              </>
            ) : isLogin ? (
              "Login"
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      </form>

      <div className="text-center mb-3">
        {isLogin && (
          <p className="mb-2">
            <Link className="text-decoration-none" to="/forgot-password">
              Forgot your password?
            </Link>
          </p>
        )}
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account?"}
          <Link to={`${isLogin ? "/register" : "/login"}`}>
            {isLogin ? "Register" : "Login"}
          </Link>
        </p>
      </div>

      <div className="text-center">
        <p className="text-muted mb-3">OR CONTINUE WITH</p>
        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-outline-danger"
            onClick={() => handleOAuthLogin("google")}
            disabled={loading}
          >
            Google
          </button>
          <button
            className="btn btn-outline-dark"
            onClick={() => handleOAuthLogin("github")}
            disabled={loading}
          >
            Github
          </button>
        </div>
      </div>
    </div>
  );
}
