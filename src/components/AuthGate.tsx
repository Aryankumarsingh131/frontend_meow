import { useState, type FormEvent } from 'react';
import type { Profile } from '../supervisor';
import { Droplet, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

// Real Supabase account on the synthetic Riverside demo team; data still comes from Supabase under RLS.
// ponytail: public demo login shipped in the bundle; remove before any real (non-synthetic) team uses this deployment.
const DEMO = { email: 'demo.supervisor@jalsakshi.local', password: '1234!' };

export default function AuthGate({ onAuthenticated }: { onAuthenticated: (profile: Profile) => void }) {
  // Form opens pre-filled with the demo account; the user just presses Sign in.
  const [email, setEmail] = useState(DEMO.email);
  const [password, setPassword] = useState(DEMO.password);
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault(); await signIn(email.trim(), password);
  }
  async function signIn(email: string, password: string) {
    setPending(true); setError('');
    try {
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const result = await response.json().catch(() => ({ error: `Server error (${response.status}): the sign-in API did not respond.` }));
      if (!response.ok) { setError(result.error || 'Unable to sign in.'); return; }
      onAuthenticated(result);
    } catch { setError('Unable to connect. Please check that the server is running.'); }
    finally { setPending(false); }
  }
  return <main className="auth-page"><section className="auth-story"><a href="#" className="identity"><span className="identity-icon"><Droplet size={24} /></span><span>JalSakshi<small>Water quality workspace</small></span></a><div><p className="eyebrow">CLARITY. ACCOUNTABILITY. ACTION.</p><h1>Better water.<br />Stronger communities.</h1><p>From the first field test to verified resolution. Bring your cases, evidence, and compliance together.</p><div className="water-art" aria-hidden="true"><Droplet size={96} strokeWidth={1} /><span /><span /></div></div><p className="auth-footnote">One workspace. Every step of the way.</p></section><section className="auth-form-side"><form className="auth-form" onSubmit={submit}><span className="auth-lock"><ShieldCheck size={24} /></span><p className="eyebrow">SUPERVISOR PORTAL</p><h2>Welcome back.</h2><p>Sign in to your district workspace.</p><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="username" placeholder="you@district.gov.in" value={email} onChange={e => setEmail(e.target.value)} required disabled={pending} /><label htmlFor="password">Password</label><div className="password-field"><input id="password" type={visible ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required disabled={pending} /><button type="button" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{error && <p className="auth-error" role="alert">{error}</p>}<button className="sign-in" disabled={pending} type="submit">{pending ? 'Signing in…' : 'Sign in'}<ArrowRight size={18} /></button><p className="auth-help">Sign in with your Supabase account email and password. Contact your administrator if you need access.</p></form><span className="auth-bottom">JalSakshi · Water quality management</span></section></main>;
}
