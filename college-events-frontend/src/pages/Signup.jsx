import React, { useState } from "react";
import { api } from "../api";

export default function Signup() {
  const [full_name, setFullName] = useState("");
  const [dept, setDept] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const doSignup = async () => {
    if (!full_name || !dept || !role || !username || !password) {
      setMsg("⚠️ All fields are required");
      return;
    }

    const res = await api.signup({ full_name, dept, role, username, password });
    if (res.success) {
      setMsg("✅ Account created successfully! You can now log in.");
      setTimeout(() => (window.location.href = "/"), 1500);
    } else {
      setMsg(res.message || "Signup failed");
    }
  };

  return (
    <div className="center" style={{ minHeight: "100vh", background: "linear-gradient(180deg,#eef2ff,#ffffff)" }}>
      <div className="card" style={{ width: 420 }}>
        <h2 style={{ textAlign: "center" }}>🎓 Create an Account</h2>

        <label className="label">Full Name</label>
        <input className="input" value={full_name} onChange={e => setFullName(e.target.value)} placeholder="Enter your full name" />

        <label className="label">Department</label>
        <input className="input" value={dept} onChange={e => setDept(e.target.value)} placeholder="Enter your department" />

        <label className="label">Role</label>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="staff">Staff</option>
        </select>

        <label className="label">Username</label>
        <input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username" />

        <label className="label">Password</label>
        <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Choose a password" />

        <div style={{ height: 16 }} />
        <button className="btn" style={{ width: "100%" }} onClick={doSignup}>
          Sign Up
        </button>

        {msg && <div style={{ marginTop: 10, color: "#1d4ed8", fontWeight: 600 }}>{msg}</div>}

        <p style={{ textAlign: "center", marginTop: 16 }}>
          Already have an account?{" "}
          <a href="/" style={{ color: "#2563eb", fontWeight: "bold" }}>Login</a>
        </p>
      </div>
    </div>
  );
}
