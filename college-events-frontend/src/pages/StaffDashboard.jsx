import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { api } from "../api";

export default function StaffDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState({ events: 0, registrations: 0, attendance: 0 });
  const [myEvents, setMyEvents] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", date: "", capacity: 50 });
  const [regList, setRegList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Load stats and events initially
  useEffect(() => {
    api.staffStats(user.id).then((d) => {
      if (d.success) setStats(d);
    });
    reloadMyEvents();
  }, []);

  const reloadMyEvents = () => {
    api.listEvents(`?scope=mine&created_by=${user.id}`).then((d) => {
      if (d.success) setMyEvents(d.events);
    });
  };

  const createEvent = async () => {
    if (!form.title || !form.date) return alert("Title and Date required");
    const res = await api.createEvent({ ...form, created_by: user.id });
    if (res.success) {
      setForm({ title: "", description: "", date: "", capacity: 50 });
      reloadMyEvents();
      setTab("overview");
      alert("Event created successfully!");
    }
  };

  const delEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    const res = await api.deleteEvent({ event_id: id });
    if (res.success) reloadMyEvents();
  };

  const loadRegistrations = async (id) => {
    setSelectedEvent(id);
    const res = await api.registrationsByEvent(id);
    if (res.success) setRegList(res.registrations);
  };

 const mark = async (student_id, status) => {
  const res = await api.attendanceMark({
    event_id: selectedEvent,
    student_id,
    status,
    marked_by: user.id,
  });

  if (res.success) {
    alert(`Marked ${status} for student ${student_id}`);
    loadRegistrations(selectedEvent);
  } else {
    alert("Failed to mark attendance");
  }
};


  return (
    <div className="container">
      <TopBar role="staff" name={user.full_name} />

      <div className="tabs">
        {["overview", "myevents", "registrations", "create"].map((t) => (
          <div
            key={t}
            className={`tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "overview" && "Overview"}
            {t === "myevents" && "My Events"}
            {t === "registrations" && "Registrations"}
            {t === "create" && "Create Event"}
          </div>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === "overview" && (
        <div style={{ marginTop: 16 }} className="row cols-3">
          <div className="card">
            <div className="h2">My Events</div>
            <div style={{ fontSize: 36, fontWeight: 800 }}>{stats.events}</div>
            <div className="muted">
              {myEvents.filter((e) => e.status === "active").length} active
            </div>
          </div>

          <div className="card">
            <div className="h2">Total Registrations</div>
            <div style={{ fontSize: 36, fontWeight: 800 }}>{stats.registrations}</div>
            <div className="muted">Across all events</div>
          </div>

          <div className="card">
            <div className="h2">Avg. Attendance</div>
            <div style={{ fontSize: 36, fontWeight: 800 }}>{stats.attendance}%</div>
            <div className="muted">compared to last month</div>
          </div>

          <div className="card" style={{ gridColumn: "1/-1" }}>
            <div className="h2">Recent Events</div>
            {myEvents.slice(0, 3).map((e) => (
              <div
                key={e.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderTop: "1px solid #eee",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{e.title}</div>
                  <div className="muted">
                    {e.date} • {e.registered}/{e.capacity} registered
                  </div>
                </div>
                <div>
                  <span
                    className="badge"
                    style={{
                      background: e.status === "active" ? "#111827" : "#9ca3af",
                    }}
                  >
                    {e.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MY EVENTS TAB */}
      {tab === "myevents" && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="h2">My Events</div>
          {myEvents.map((e) => (
            <div
              key={e.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderTop: "1px solid #eee",
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{e.title}</div>
                <div className="muted">
                  {e.date} • {e.registered}/{e.capacity} registered
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn light"
                  onClick={() => {
                    setTab("registrations");
                    loadRegistrations(e.id);
                  }}
                >
                  Registrations
                </button>
                <button className="btn light" onClick={() => delEvent(e.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {myEvents.length === 0 && <div className="muted">No events yet.</div>}
        </div>
      )}

      {/* REGISTRATIONS TAB */}
      {tab === "registrations" && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="h2">
            Registrations {selectedEvent ? `#${selectedEvent}` : ""}
          </div>
          {!selectedEvent && (
            <div className="muted">
              Open “My Events” and click “Registrations”.
            </div>
          )}
          {selectedEvent &&
            regList.map((s) => (
              <div
                key={s.student_id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderTop: "1px solid #eee",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {s.full_name || s.username}
                  </div>
                  <div className="muted">{s.dept}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn light"
                    onClick={() => mark(s.student_id, "present")}
                  >
                    Mark Present
                  </button>
                  <button
                    className="btn light"
                    onClick={() => mark(s.student_id, "absent")}
                  >
                    Mark Absent
                  </button>
                </div>
              </div>
            ))}
          {selectedEvent && regList.length === 0 && (
            <div className="muted">No students yet.</div>
          )}
        </div>
      )}

      {/* CREATE EVENT TAB */}
      {tab === "create" && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="h2">Create Event</div>
          <div className="row cols-2">
            <div>
              <label className="label">Title</label>
              <input
                className="input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Date</label>
              <input
                className="input"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>
          <div style={{ height: 12 }} />
          <label className="label">Description</label>
          <textarea
            className="input"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div style={{ height: 12 }} />
          <label className="label">Capacity</label>
          <input
            className="input"
            type="number"
            value={form.capacity}
            onChange={(e) =>
              setForm({ ...form, capacity: parseInt(e.target.value || 50) })
            }
          />
          <div style={{ height: 16 }} />
          <button className="btn" onClick={createEvent}>
            Create
          </button>
        </div>
      )}
    </div>
  );
}
