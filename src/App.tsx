import { useEffect, useState, useCallback } from 'react';
import { Droplet, LayoutDashboard, LogOut, ArrowRight, FolderKanban, BarChart3, RefreshCw, PhoneIncoming } from 'lucide-react';
import AuthGate from './components/AuthGate';
import SupervisorCasesView from './components/SupervisorCasesView';
import ReportsView from './components/ReportsView';
import { api, ApiError, date, shortId, type Profile, type Workspace } from './supervisor';
import './dashboard.css';
import './supervisor.css';

function Dashboard({ profile, onLogout }: { profile: Profile; onLogout: () => void }) {
 const [screen,setScreen]=useState<'overview'|'cases'|'reports'>('overview');
 const [data,setData]=useState<Workspace|null>(null);
 const [selected,setSelected]=useState<string|null>(null);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 const [notice,setNotice]=useState('');
 const load=useCallback(async()=>{try{const result=await api<Workspace>('workspace');setData(result);setError('')}catch(e){setError(e instanceof Error?e.message:'Could not load the workspace.')}finally{setLoading(false)}},[]);
 // The loader updates state only after its asynchronous API request settles.
 // oxlint-disable-next-line react/set-state-in-effect
 useEffect(()=>{void load()},[load]);
 async function mutate(path:string,body:unknown,method='POST'){
  setNotice('');
  try{await api(path,body,method);await load();setNotice('Saved. The case history has been updated.')}
  catch(e){if(e instanceof ApiError && e.status===409){await load();setError('Another supervisor changed this record. Review the refreshed evidence before trying again.')}throw e}
 }
 const navigation=[{id:'overview' as const,label:'Overview',icon:LayoutDashboard},{id:'cases' as const,label:'Cases',icon:FolderKanban},{id:'reports' as const,label:'Reports',icon:BarChart3}];
 const open=data?.cases.filter(c=>c.status==='under_review')||[];
 const closed=data?.cases.filter(c=>c.status==='closed')||[];
 const complaints=data?.ivr_complaints.filter(c=>c.status==='new')||[];
 return <div className="workspace">
  <aside className="sidebar"><a className="identity" href="#main-content" onClick={()=>setScreen('overview')}><span className="identity-icon"><Droplet size={23}/></span><span>JalSakshi<small>Water quality workspace</small></span></a><p className="nav-caption">WORKSPACE</p><nav aria-label="Main navigation">{navigation.map(({id,label,icon:Icon})=><button key={id} aria-current={screen===id?'page':undefined} className={screen===id?'selected':''} onClick={()=>setScreen(id)}><Icon size={18}/>{label}</button>)}</nav><div className="sidebar-bottom"><span className="avatar">S</span><div><strong>Supervisor</strong><small>{profile.email}</small></div><button className="logout" onClick={onLogout} aria-label="Sign out"><LogOut size={18}/></button></div></aside>
  <main className="dashboard-main" id="main-content"><header className="workspace-header"><span>{profile.team_name}<span className="breadcrumb">/ {navigation.find(n=>n.id===screen)?.label}</span></span><span className="sample-label">{profile.dataMode==='synthetic'?'Synthetic data':'Team data'}</span></header><div className="page-intro"><div><h1>{screen==='overview'?'Your team, at a glance.':screen==='cases'?'Evidence to action':'Reports & summaries'}</h1><p>{screen==='cases'?'Review each source of evidence. Record the action. Close only when supported.':'Cases and evidence scoped to your assigned jurisdiction.'}</p></div><button className="secondary-button" onClick={()=>{setLoading(true);void load()}} disabled={loading}><RefreshCw size={16}/>{loading?'Refreshing…':'Refresh'}</button></div>
  {error&&<div className="form-error" role="alert">{error}</div>}{notice&&<div className="save-notice" role="status">{notice}</div>}
  {!data&&!error&&<p role="status">Loading your team’s cases…</p>}
  {data&&screen==='overview'&&<><div className="overview-stats">{[{label:'Open cases',value:open.length,hint:'Awaiting evidence and review'},{label:'Urgent / critical',value:open.filter(c=>c.priority!=='normal').length,hint:'Open cases requiring attention'},{label:'Verified closures',value:closed.length,hint:'Closed through the guarded function'},{label:'New IVR complaints',value:complaints.length,hint:'Awaiting case linkage'}].map(stat=><article key={stat.label}><p>{stat.label}</p><strong>{stat.value}</strong><small>{stat.hint}</small></article>)}</div><section className="overview-panel priority-overview"><div className="panel-heading"><div><h2>Case review queue</h2><p>Measured counts from current team records. No turnaround targets are shown as results.</p></div><button className="text-button" onClick={()=>setScreen('cases')}>Open board <ArrowRight size={16}/></button></div><div className="attention-list">{open.slice().sort((a,b)=>({critical:0,urgent:1,normal:2}[a.priority]-{critical:0,urgent:1,normal:2}[b.priority])).map(c=><button key={c.id} onClick={()=>{setSelected(c.id);setScreen('cases')}}><Droplet size={18}/><span className="attention-name"><strong>{data.water_sources.find(s=>s.id===c.source_id)?.name||'Water source'}</strong><small>{shortId(c.id)} · {date(c.created_at)}</small></span><span className={`state-badge ${c.priority}`}>{c.priority}</span><ArrowRight size={16}/></button>)}{!open.length&&<p className="empty-state">No open cases in your team.</p>}</div></section>{complaints.length>0&&<button className="complaint-shortcut" onClick={()=>setScreen('cases')}><PhoneIncoming size={18}/>{complaints.length} phone-in complaint{complaints.length===1?'':'s'} need review <ArrowRight size={16}/></button>}</>}
  {data&&screen==='cases'&&<SupervisorCasesView data={data} selectedId={selected} onSelect={setSelected} onMutate={mutate}/>}
  {data&&screen==='reports'&&<ReportsView data={data}/>}
  </main></div>
}
export default function App(){
 const [profile,setProfile]=useState<Profile|null>(null);const [loading,setLoading]=useState(true);const [error,setError]=useState('');
 useEffect(()=>{let cancelled=false;const check=async()=>{try{const response=await fetch('/api/auth/session');if(cancelled)return;if(response.ok){setProfile(await response.json());setError('')}else if(response.status===401||response.status===403){setProfile(null);if(response.status===403)setError((await response.json()).error)}}catch{if(!cancelled)setError('Unable to reach the server. Check your connection and refresh.')}finally{if(!cancelled)setLoading(false)}};void check();const timer=window.setInterval(check,60000);return()=>{cancelled=true;clearInterval(timer)}},[]);
 const logout=async()=>{try{const response=await fetch('/api/auth/logout',{method:'POST'});if(!response.ok)throw new Error();setProfile(null);setError('')}catch{setError('Could not sign out. Please try again.')}};
 if(loading)return <div className="auth-loading" role="status">Loading your workspace…</div>;
 return <>{error&&<div className="session-error" role="alert">{error}</div>}{profile?<Dashboard profile={profile} onLogout={logout}/>:<AuthGate onAuthenticated={setProfile}/>}</>
}

