import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import "./index.css";

const RequireAuth = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user")||"null");
  if (!user || user.role !== role) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
        <Route path="/staff" element={<RequireAuth role="staff"><StaffDashboard /></RequireAuth>} />
        <Route path="/student" element={<RequireAuth role="student"><StudentDashboard /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}
