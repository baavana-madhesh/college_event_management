import React from "react";

export default function TopBar({ role, name }) {
  const logout = () => { localStorage.removeItem("user"); window.location.href = "/"; };
  return (
    <div className="nav">
      <div>
        <div className="h1" style={{display:'flex', gap:8, alignItems:'center'}}>
          {role.charAt(0).toUpperCase()+role.slice(1)} Dashboard
          <span className="badge">{role === 'staff' ? 'Staff Member' : role === 'admin' ? 'Admin' : 'Student'}</span>
        </div>
        <div className="muted">Welcome back, {name || 'User'}</div>
      </div>
      <button className="btn light" onClick={logout}>Logout</button>
    </div>
  );
}
