import React, { useState } from "react";
import { api } from "../api";

export default function Login() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const doLogin = async () => {
    setMsg("");
    const res = await api.login({ role, username, password });
    if (res.success) {
      localStorage.setItem("user", JSON.stringify(res.user));
      if (role === "admin") window.location.href = "/admin";
      if (role === "staff") window.location.href = "/staff";
      if (role === "student") window.location.href = "/student";
    } else setMsg(res.message || "Login failed");
  };

  const quick = (r,u,p) => { setRole(r); setUsername(u); setPassword(p); };

  return (
    <div className="center" style={{minHeight:'100vh', background:'linear-gradient(180deg,#eef2ff,#ffffff)'}}>
      <div className="card" style={{width:420}}>
        <div className="center" style={{marginBottom:8}}>
          <div style={{fontSize:36}}>🎓</div>
        </div>
        <h2 className="h1" style={{textAlign:'center'}}>College Events</h2>
        <p className="muted" style={{textAlign:'center', marginBottom:16}}>Sign in to your account</p>

        <div className="h2" style={{marginTop:4}}>Login</div>
        <p className="muted" style={{marginTop:0}}>Choose your role and enter your credentials</p>

        <label className="label">Role</label>
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="">Select your role</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="student">Student</option>
        </select>

        <div style={{height:12}}/>
        <label className="label">Username</label>
        <input className="input" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Enter username" />

        <div style={{height:12}}/>
        <label className="label">Password</label>
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" />

        <div style={{height:16}}/>
        <button className="btn" onClick={doLogin} style={{width:'100%'}}>Sign In</button>
        {msg && <div style={{color:'#dc2626', marginTop:10, fontWeight:600}}>{msg}</div>}

        <div className="muted" style={{textAlign:'center', marginTop:16}}>Quick Login (Demo)</div>
        <div className="row cols-3" style={{marginTop:8}}>
          <button className="btn light" onClick={()=>quick('admin','admin','admin123')}>Admin</button>
          <button className="btn light" onClick={()=>quick('staff','staff1','staff123')}>Staff</button>
          <button className="btn light" onClick={()=>quick('student','student1','student123')}>Student</button>
        </div>

        <div className="muted" style={{textAlign:'center', marginTop:12}}>
          Demo Credentials: Admin admin/admin123 | Staff staff1/staff123 | Student student1/student123
        </div>
      </div>
    </div>
  );
}
