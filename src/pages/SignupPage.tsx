import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleSignup = async (e: React.FormEvent) => {
    console.log("handleSignup");
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log("auth", auth);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirect or show success message as needed
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
      console.log("Signup error:", err);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0fdfa 0%, #e0e7ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 400,
          width: "100%",
          padding: 32,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(31, 41, 55, 0.15)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          {/* Logo Placeholder */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 28,
              margin: "0 auto",
              boxShadow: "0 2px 8px rgba(16,185,129,0.15)",
            }}
          >
            TM
          </div>
        </div>
        <h2 style={{ marginBottom: 8 }}>Create Account</h2>
        <p style={{ color: "#6b7280", marginBottom: 24, fontSize: 15 }}>
          Sign up to start managing your tasks
        </p>
        <form onSubmit={handleSignup} style={{ width: "100%" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 500 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                marginTop: 6,
                border: "1px solid #d1d5db",
                borderRadius: 8,
                fontSize: 15,
                outline: "none",
                transition: "border 0.2s",
              }}
              autoComplete="username"
            />
          </div>
          <div style={{ marginBottom: 16, position: "relative" }}>
            <label style={{ fontWeight: 500 }}>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 38px 10px 12px",
                marginTop: 6,
                border: "1px solid #d1d5db",
                borderRadius: 8,
                fontSize: 15,
                outline: "none",
                transition: "border 0.2s",
              }}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: "absolute",
                right: 10,
                top: 34,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#10b981",
                fontSize: 15,
                padding: 0,
              }}
              tabIndex={-1}
            >
              {showPassword ? <FaRegEye /> :<FaRegEyeSlash />}
            </button>
          </div>
          {error && (
            <div
              style={{
                color: "#ef4444",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 0",
              background: loading ? "#6ee7b7" : "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              marginBottom: 8,
              boxShadow: "0 2px 8px rgba(16,185,129,0.08)",
            }}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div style={{ marginTop: 12, fontSize: 15 }}>
          Already have an account?{" "}
          <a
            href="/"
            style={{
              color: "#10b981",
              textDecoration: "underline",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
