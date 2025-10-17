import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { api } from "../api";

export default function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [tab, setTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postForm, setPostForm] = useState({ title: "", content: "" });
  const [feedback, setFeedback] = useState({});
  const [profile, setProfile] = useState(user);

  // 🔹 Load all events
  const loadEvents = () => 
    api.listEvents()
       .then(d => { if (d.success && d.events) setEvents(d.events); })
       .catch(err => console.error("Failed to load events:", err));

  // 🔹 Load student's registered events
  const loadMyEvents = () => 
    api.registrationsByStudent(user.id)
       .then(d => { if (d.success && d.events) setMyEvents(d.events); else setMyEvents([]); })
       .catch(err => { console.error("Failed to load my events:", err); setMyEvents([]); });


  // 🔹 Load attendance
  const loadAttendance = () => 
    api.attendanceList(user.id)
       .then(d => { if (d.success && d.records) setAttendance(d.records); })
       .catch(err => console.error("Failed to load attendance:", err));

  // 🔹 Load notifications
  const loadNotifications = () => 
    api.notifyList(user.id)
       .then(d => { if (d.success && d.notifications) setNotifications(d.notifications); })
       .catch(err => console.error("Failed to load notifications:", err));

  // 🔹 Load forum posts
  const loadForum = () => 
    api.forumList()
       .then(d => { if (d.success && d.posts) setPosts(d.posts); })
       .catch(err => console.error("Failed to load forum:", err));

  useEffect(() => {
    loadEvents();
    loadMyEvents();
    loadAttendance();
    loadNotifications();
    loadForum();
  }, []);

  // 🔹 Register for an event
  const register = async (id) => {
    const r = await api.registerEvent({ event_id: id, student_id: user.id });
    if (r.success) {
      alert("Registered successfully!");
      loadMyEvents();
    }
  };

  // 🔹 Create forum post
  const createPost = async () => {
    if (!postForm.title || !postForm.content) return;
    const r = await api.forumCreate({ user_id: user.id, ...postForm });
    if (r.success) {
      setPostForm({ title: "", content: "" });
      loadForum();
    }
  };

  // 🔹 Submit feedback
  const submitFeedback = async (event_id) => {
    const rating = feedback[event_id];
    if (!rating) return alert("Please select a rating");
    const r = await api.submitFeedback({ event_id, student_id: user.id, rating });
    if (r.success) alert("Feedback submitted!");
  };

  // 🔹 Update profile
  const updateProfile = async () => {
  // get current user info from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // include student_id in profile payload
  const payload = {
    ...profile,
    student_id: user?.student_id, // <-- this line is critical
  };

  try {
    const r = await api.updateProfile(payload);

    if (r.status === "success" || r.success) {
      alert("Profile updated successfully!");
      localStorage.setItem("user", JSON.stringify(payload));
    } else {
      alert(r.message || "Update failed");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Something went wrong while updating profile.");
  }
};


  return (
    <div className="container">
      <TopBar role="student" name={user.full_name} />

      <div className="tabs">
        {["events","myevents","attendance","forum","notifications","profile"].map(t => (
          <div 
            key={t} 
            className={`tab ${tab === t ? 'active' : ''}`} 
            onClick={() => setTab(t)}
          >
            {t === "myevents" ? "My Events" : t.charAt(0).toUpperCase() + t.slice(1)}
          </div>
        ))}
      </div>

      {/* All Events */}
      {tab === 'events' && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="h2">Available Events</div>
          {events.length > 0 ? events.map(e => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #eee' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{e.title}</div>
                <div className="muted">{e.date} • {e.registered}/{e.capacity} registered</div>
              </div>
              <button className="btn light" onClick={() => register(e.id)}>Register</button>
            </div>
          )) : <div className="muted">No events available.</div>}
        </div>
      )}

      {/* My Events */}
      {tab === 'myevents' && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="h2">My Registered Events</div>
          {myEvents.length > 0 ? myEvents.map(e => (
            <div key={e.id} style={{ borderTop: '1px solid #eee', padding: '10px 0' }}>
              <div style={{ fontWeight: 700 }}>{e.title}</div>
              <div className="muted">{e.date}</div>
              <div style={{ marginTop: 6 }}>
                <label>Feedback:</label>{" "}
                <select value={feedback[e.id] || ""} onChange={ev => setFeedback({ ...feedback, [e.id]: ev.target.value })}>
                  <option value="">Select Rating</option>
                  <option value="5">⭐⭐⭐⭐⭐</option>
                  <option value="4">⭐⭐⭐⭐</option>
                  <option value="3">⭐⭐⭐</option>
                  <option value="2">⭐⭐</option>
                  <option value="1">⭐</option>
                </select>
                <button className="btn light" style={{ marginLeft: 8 }} onClick={() => submitFeedback(e.id)}>Submit</button>
              </div>
            </div>
          )) : <div className="muted">No registered events yet.</div>}
        </div>
      )}

      {/* Attendance */}
      {tab === 'attendance' && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="h2">Attendance Records</div>
          {attendance.length > 0 ? attendance.map(a => (
            <div key={a.event_id} style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', padding: '10px 0' }}>
              <div>{a.event_title}</div>
              <div style={{ fontWeight: 700, color: a.status === 'Present' ? '#16a34a' : '#dc2626' }}>{a.status}</div>
            </div>
          )) : <div className="muted">No attendance marked yet.</div>}
        </div>
      )}

      {/* Forum */}
      {tab === 'forum' && (
        <>
          <div className="card" style={{ marginTop: 16 }}>
            <div className="h2">Create a Post</div>
            <label className="label">Title</label>
            <input className="input" value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} />
            <div style={{ height: 12 }} />
            <label className="label">Content</label>
            <textarea className="input" rows={4} value={postForm.content} onChange={e => setPostForm({ ...postForm, content: e.target.value })} />
            <div style={{ height: 12 }} />
            <button className="btn" onClick={createPost}>Post</button>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="h2">Recent Posts</div>
            {posts.length > 0 ? posts.map(p => (
              <div key={p.id} style={{ padding: '10px 0', borderTop: '1px solid #eee' }}>
                <div style={{ fontWeight: 700 }}>{p.title}</div>
                <div className="muted" style={{ fontSize: 12 }}>by {p.username} ({p.role})</div>
                <div style={{ marginTop: 6 }}>{p.content}</div>
              </div>
            )) : <div className="muted">No posts yet.</div>}
          </div>
        </>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="h2">Notifications</div>
          {notifications.length > 0 ? notifications.map((n,i) => (
            <div key={i} style={{ borderTop: '1px solid #eee', padding: '10px 0' }}>
              <div style={{ fontWeight: 700 }}>{n.title}</div>
              <div className="muted">{n.message}</div>
            </div>
          )) : <div className="muted">No notifications yet.</div>}
        </div>
      )}

      {/* Profile */}
      {tab === 'profile' && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="h2">My Profile</div>
          <label className="label">Full Name</label>
          <input className="input" value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })} />
          <div style={{ height: 12 }} />
          <label className="label">Department</label>
          <input className="input" value={profile.dept} onChange={e => setProfile({ ...profile, dept: e.target.value })} />
          <div style={{ height: 12 }} />
          <label className="label">Username</label>
          <input className="input" disabled value={profile.username} />
          <div style={{ height: 16 }} />
          <button className="btn" onClick={updateProfile}>Update Profile</button>
        </div>
      )}

    </div>
  );
}
