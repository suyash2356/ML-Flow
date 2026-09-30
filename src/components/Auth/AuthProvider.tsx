import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { AuthContext } from './AuthContext';
import { supabase, supabaseConfigured } from '../../services/supabase';
import './AuthProvider.css';

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = supabase;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabase) return;

    let alive = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (alive) {
        setSession(nextSession);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (!alive) return;
      if (error) console.error('Unable to restore Supabase session:', error.message);
      setSession(data.session);
      setLoading(false);
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!supabaseConfigured || !client) return <AuthSetupScreen />;
  if (loading) {
    return <main className="auth-screen"><p role="status">Restoring your session...</p></main>;
  }
  if (!session) return <AuthScreen />;

  return (
    <AuthContext.Provider value={{
      session,
      signOut: async () => {
        const { error } = await client.auth.signOut();
        if (error) throw error;
      },
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function AuthSetupScreen() {
  return (
    <main className="auth-screen">
      <section className="auth-panel" aria-labelledby="auth-setup-title">
        <p className="auth-eyebrow">ML FLOW / SETUP</p>
        <h1 id="auth-setup-title">Connect your workspace</h1>
        <p className="auth-copy">Supabase credentials are missing. Add the project URL and public anon/publishable key to <code>.env.local</code>, then restart the dev server.</p>
        <pre className="auth-env-example">VITE_SUPABASE_URL=https://your-project.supabase.co<br />VITE_SUPABASE_ANON_KEY=your-public-key</pre>
        <p className="auth-note">Never put a service-role key in a browser app.</p>
      </section>
    </main>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage('');
    setErrorMessage('');

    try {
      if (mode === 'sign-up') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: displayName.trim() } },
        });
        if (error) throw error;
        if (!data.session) {
          setMessage('Check your email to confirm your account, then sign in.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-screen">
      <section className="auth-panel" aria-labelledby="auth-title">
        <p className="auth-eyebrow">ML FLOW / SECURE WORKSPACE</p>
        <h1 id="auth-title">{mode === 'sign-in' ? 'Welcome back.' : 'Create your account.'}</h1>
        <p className="auth-copy">Your projects are private to your account.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'sign-up' && (
            <label>Display name<input autoComplete="name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} required maxLength={100} /></label>
          )}
          <label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} /></label>
          <label>Password<input type="password" autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} /></label>
          {message && <p className="auth-message" role="status">{message}</p>}
          {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}
          <button className="auth-submit" type="submit" disabled={busy}>{busy ? 'Please wait...' : mode === 'sign-in' ? 'Sign in' : 'Create account'}</button>
        </form>
        <button className="auth-mode-toggle" type="button" onClick={() => { setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in'); setMessage(''); setErrorMessage(''); }}>
          {mode === 'sign-in' ? 'New to ML Flow? Create an account' : 'Already registered? Sign in'}
        </button>
        <p className="auth-note">Use a unique password. Account confirmation may be required by your Supabase Auth settings.</p>
      </section>
    </main>
  );
}