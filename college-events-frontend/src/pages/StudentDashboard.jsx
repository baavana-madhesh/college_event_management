import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { api } from "../api";

export default function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tab, setTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postForm, setPostForm] = useState({ title:"", content:"" });

  const loadEvents = ()=> api.listEvents().then(d=>{ if(d.success) setEvents(d.events); });
  const loadForum  = ()=> api.forumList().then(d=>{ if(d.success) setPosts(d.posts); });

  useEffect(()=>{ loadEvents(); loadForum(); },[]);

  const register = async (id)=> {
    const r = await api.registerEvent({ event_id:id, student_id:user.id });
    if (r.success) { alert("Registered"); loadEvents(); }
  };
  const createPost = async ()=> {
    if(!postForm.title || !postForm.content) return;
    const r = await api.forumCreate({ user_id:user.id, ...postForm });
    if(r.success){ setPostForm({title:"",content:""}); loadForum(); }
  };

  return (
    <div className="container">
      <TopBar role="student" name={user.full_name} />
      <div className="tabs">
        <div className={`tab ${tab==='events'?'active':''}`} onClick={()=>setTab('events')}>Events</div>
        <div className={`tab ${tab==='forum'?'active':''}`} onClick={()=>setTab('forum')}>Discussion Forum</div>
      </div>

      {tab==='events' && (
        <div className="card" style={{marginTop:16}}>
          <div className="h2">Available Events</div>
          {events.map(e=>(
            <div key={e.id} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderTop:'1px solid #eee'}}>
              <div>
                <div style={{fontWeight:700}}>{e.title}</div>
                <div className="muted">{e.date} • {e.registered}/{e.capacity} registered</div>
              </div>
              <button className="btn light" onClick={()=>register(e.id)}>Register</button>
            </div>
          ))}
          {events.length===0 && <div className="muted">No events yet.</div>}
        </div>
      )}

      {tab==='forum' && (
        <>
          <div className="card" style={{marginTop:16}}>
            <div className="h2">Create a Post</div>
            <label className="label">Title</label>
            <input className="input" value={postForm.title} onChange={e=>setPostForm({...postForm,title:e.target.value})}/>
            <div style={{height:12}}/>
            <label className="label">Content</label>
            <textarea className="input" rows={4} value={postForm.content} onChange={e=>setPostForm({...postForm,content:e.target.value})}/>
            <div style={{height:12}}/>
            <button className="btn" onClick={createPost}>Post</button>
          </div>

          <div className="card" style={{marginTop:16}}>
            <div className="h2">Recent Posts</div>
            {posts.map(p=>(
              <div key={p.id} style={{padding:'10px 0', borderTop:'1px solid #eee'}}>
                <div style={{fontWeight:700}}>{p.title}</div>
                <div className="muted" style={{fontSize:12}}>by {p.username} ({p.role})</div>
                <div style={{marginTop:6}}>{p.content}</div>
              </div>
            ))}
            {posts.length===0 && <div className="muted">No posts yet.</div>}
          </div>
        </>
      )}
    </div>
  );
}
