import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function PasswordStrengthMeter({
  password,
  userInfo = {},
  onFeedback,
}) {
  const [strength, setStrength] = useState({
    score: 0,
    feedback: {
      warning: "",
      suggestions: [],
    },
  });

  useEffect(() => {
    if (!password) {
      setStrength({
        score: 0,
        feedback: {
          warning: "",
          suggestions: [],
        },
      });

      if (onFeedback) {
        onFeedback({
          valid: false,
          message: "Password is required",
          score: 0,
        });
      }
      return;
    }

    const basicChecks = [];

    if (password.length < 8) {
      basicChecks.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      basicChecks.push("Add uppercase letters");
    }

    if (!/[a-z]/.test(password)) {
      basicChecks.push("Add lowercase letters");
    }

    if (!/\d/.test(password)) {
      basicChecks.push("Add numbers");
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      basicChecks.push("Add special characters (e.g., !@#$%)");
    }

    const commonPasswords = [
      "password",
      "123456",
      "qwerty",
      "admin",
      "welcome",
    ];
    if (commonPasswords.includes(password.toLowerCase())) {
      basicChecks.push("Avoid common passwords");
    }

    const userInfoToCheck = [
      userInfo.name,
      userInfo.email,
      userInfo.username,
    ].filter(Boolean);

    const containsPersonalInfo = userInfoToCheck.some(
      (info) => info && password.toLowerCase().includes(info.toLowerCase())
    );

    if (containsPersonalInfo) {
      basicChecks.push("Avoid using personal information in your password");
    }

    let calculatedScore;
    if (basicChecks.length === 0) {
      calculatedScore = 4; // Very strong
    } else if (basicChecks.length <= 1) {
      calculatedScore = 3; // Strong
    } else if (basicChecks.length <= 2) {
      calculatedScore = 2; // Medium
    } else if (basicChecks.length <= 3) {
      calculatedScore = 1; // Weak
    } else {
      calculatedScore = 0; // Very weak
    }

    setStrength({
      score: calculatedScore,
      feedback: { warning: basicChecks[0] || "", suggestions: basicChecks },
    });
  });
  return <div>PasswordStrengthMeter</div>;
}
