import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { api } from "../api";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tab, setTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title:"", description:"", date:"", capacity:100 });
  const [notify, setNotify] = useState({ message:"", target:"all" });
  const [regList, setRegList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const loadEvents = ()=> api.listEvents().then(d=>{ if(d.success) setEvents(d.events); });
  useEffect(()=>{ loadEvents(); },[]);

  const createEvent = async ()=> {
    if(!form.title || !form.date) return alert("Title and Date required");
    const res = await api.createEvent({ ...form, created_by: user.id });
    if (res.success) { setForm({ title:"", description:"", date:"", capacity:100 }); loadEvents(); }
  };
  const delEvent = async (id)=>{ if(window.confirm("Delete?")){ const r=await api.deleteEvent({event_id:id}); if(r.success) loadEvents(); } };
  const sendNotify = async ()=> { const r = await api.notifyCreate({ ...notify, created_by: user.id }); if(r.success){ setNotify({message:"", target:"all"}); alert("Notification sent"); } };
  const openRegs = async (id)=>{ setSelectedEvent(id); const r = await api.registrationsByEvent(id); if(r.success) setRegList(r.registrations); setTab("registrations"); };

  return (
    <div className="container">
      <TopBar role="admin" name={user.full_name} />
      <div className="tabs">
        <div className={`tab ${tab==='events'?'active':''}`} onClick={()=>setTab('events')}>Events</div>
        <div className={`tab ${tab==='create'?'active':''}`} onClick={()=>setTab('create')}>Create Event</div>
        <div className={`tab ${tab==='notify'?'active':''}`} onClick={()=>setTab('notify')}>Send Notification</div>
        <div className={`tab ${tab==='registrations'?'active':''}`} onClick={()=>setTab('registrations')}>Registrations</div>
      </div>

      {tab==='events' && (
        <div className="card" style={{marginTop:16}}>
          <div className="h2">All Events</div>
          {events.map(e=>(
            <div key={e.id} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderTop:'1px solid #eee'}}>
              <div>
                <div style={{fontWeight:700}}>{e.title}</div>
                <div className="muted">{e.date} • {e.registered}/{e.capacity} registered</div>
              </div>
              <div style={{display:'flex', gap:8}}>
                <button className="btn light" onClick={()=>openRegs(e.id)}>Registrations</button>
                <button className="btn light" onClick={()=>delEvent(e.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='create' && (
        <div className="card" style={{marginTop:16}}>
          <div className="h2">Create Event</div>
          <div className="row cols-2">
            <div>
              <label className="label">Title</label>
              <input className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
            </div>
            <div>
              <label className="label">Date</label>
              <input className="input" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
            </div>
          </div>
          <div style={{height:12}}/>
          <label className="label">Description</label>
          <textarea className="input" rows={4} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
          <div style={{height:12}}/>
          <label className="label">Capacity</label>
          <input className="input" type="number" value={form.capacity} onChange={e=>setForm({...form,capacity:parseInt(e.target.value||100)})}/>
          <div style={{height:16}}/>
          <button className="btn" onClick={createEvent}>Create</button>
        </div>
      )}

      {tab==='notify' && (
        <div className="card" style={{marginTop:16}}>
          <div className="h2">Send Notification</div>
          <label className="label">Message</label>
          <input className="input" value={notify.message} onChange={e=>setNotify({...notify,message:e.target.value})}/>
          <div style={{height:12}}/>
          <label className="label">Target</label>
          <select value={notify.target} onChange={e=>setNotify({...notify,target:e.target.value})}>
            <option value="all">All</option>
            <option value="staff">Staff</option>
            <option value="students">Students</option>
          </select>
          <div style={{height:16}}/>
          <button className="btn" onClick={sendNotify}>Send</button>
        </div>
      )}

      {tab==='registrations' && (
        <div className="card" style={{marginTop:16}}>
          <div className="h2">Registrations {selectedEvent ? `for Event #${selectedEvent}` : ""}</div>
          {!selectedEvent && <div className="muted">Open “Events” and click “Registrations”.</div>}
          {selectedEvent && regList.map(s=>(
            <div key={s.student_id} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderTop:'1px solid #eee'}}>
              <div>
                <div style={{fontWeight:700}}>{s.full_name || s.username}</div>
                <div className="muted">{s.dept}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
