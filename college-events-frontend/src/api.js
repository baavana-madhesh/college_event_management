const BASE = "http://localhost/MINi_project/api";

export const api = {
  // ✅ Common login (works for both admin & student)
  login: (payload) =>
    fetch(`${BASE}/login.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(r => r.json()),

  // ✅ Events
  listEvents: (params = "") =>
    fetch(`${BASE}/events_list.php${params}`).then(r => r.json()),

  createEvent: (payload) =>
    fetch(`${BASE}/event_create.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(r => r.json()),

  deleteEvent: (payload) =>
    fetch(`${BASE}/event_delete.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(r => r.json()),

  // ✅ Student actions
  registerEvent: (payload) =>
    fetch(`${BASE}/event_register.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(r => r.json()),

  registrationsByEvent: (event_id) =>
    fetch(`${BASE}/registrations_by_event.php?event_id=${event_id}`)
      .then(r => r.json()),

  markAttendance: (payload) =>
    fetch(`${BASE}/attendance_mark.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(r => r.json()),

  // ✅ Stats (admin / staff)
  staffStats: (staff_id) =>
    fetch(`${BASE}/stats_staff.php?staff_id=${staff_id}`)
      .then(r => r.json()),

  // ✅ Notifications
  notifyCreate: (payload) =>
    fetch(`${BASE}/notify_create.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(r => r.json()),

  // ✅ Forum
  forumList: () =>
    fetch(`${BASE}/forum_posts.php`).then(r => r.json()),

  forumCreate: (payload) =>
    fetch(`${BASE}/forum_posts.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(r => r.json()),

  forumComments: (post_id) =>
    fetch(`${BASE}/forum_comments.php?post_id=${post_id}`)
      .then(r => r.json()),

  forumCommentCreate: (payload) =>
    fetch(`${BASE}/forum_comments.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(r => r.json()),
};
