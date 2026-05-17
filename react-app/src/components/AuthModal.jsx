import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

export default function AuthModal({ onClose }) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('signin');

  // Sign In state
  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [siError, setSiError] = useState('');
  const [siLoading, setSiLoading] = useState(false);

  // Sign Up state
  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suError, setSuError] = useState('');
  const [suLoading, setSuLoading] = useState(false);
  const [suSuccess, setSuSuccess] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSiError('');
    if (!siEmail || !siPassword) { setSiError('Email and password are required.'); return; }
    setSiLoading(true);
    const result = await signIn(siEmail, siPassword);
    setSiLoading(false);
    if (result.error) { setSiError(result.error); return; }
    onClose();
    if (result.role === 'admin') {
      navigate('/admin');   // React Router navigate — no page reload, state is preserved
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSuError('');
    if (!suName || !suEmail || !suPassword) { setSuError('All fields are required.'); return; }
    if (suPassword.length < 6) { setSuError('Password must be at least 6 characters.'); return; }
    setSuLoading(true);
    const result = await signUp(suEmail, suPassword, suName);
    setSuLoading(false);
    if (result.error) { setSuError(result.error); return; }
    setSuSuccess(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose} aria-label="Close">&times;</button>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'signin' ? 'active' : ''}`} onClick={() => setTab('signin')}>Sign In</button>
          <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>Create Account</button>
        </div>

        {tab === 'signin' && (
          <form onSubmit={handleSignIn}>
            <p className="auth-welcome">Welcome back</p>

            <fieldset>
              <legend>Email</legend>
              <input type="email" value={siEmail} onChange={e => setSiEmail(e.target.value)} placeholder="your@email.com" autoComplete="email" required />
            </fieldset>

            <fieldset>
              <legend>Password</legend>
              <input type="password" value={siPassword} onChange={e => setSiPassword(e.target.value)} placeholder="••••••••" required />
            </fieldset>

            {siError && <span className="error-msg">{siError}</span>}

            <input type="submit" value={siLoading ? 'Signing in…' : 'Sign In'} disabled={siLoading} />

            <div className="divider"><span>or</span></div>
            <button type="button" className="google-btn" onClick={signInWithGoogle}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className="auth-switch">Don't have an account? <button type="button" onClick={() => setTab('signup')}>Create one</button></p>
          </form>
        )}

        {tab === 'signup' && (
          <form onSubmit={handleSignUp}>
            <p className="auth-welcome">Create your account</p>

            {suSuccess ? (
              <div className="success-msg">
                <p>Account created! Please check your email to confirm, then sign in.</p>
                <button type="button" onClick={() => setTab('signin')}>Go to Sign In</button>
              </div>
            ) : (
              <>
                <fieldset>
                  <legend>Full Name</legend>
                  <input type="text" value={suName} onChange={e => setSuName(e.target.value)} placeholder="Your full name" autoComplete="name" required />
                </fieldset>

                <fieldset>
                  <legend>Email</legend>
                  <input type="email" value={suEmail} onChange={e => setSuEmail(e.target.value)} placeholder="your@email.com" autoComplete="email" required />
                </fieldset>

                <fieldset>
                  <legend>Password</legend>
                  <input type="password" value={suPassword} onChange={e => setSuPassword(e.target.value)} placeholder="Min 6 characters" required />
                </fieldset>

                {suError && <span className="error-msg">{suError}</span>}

                <input type="submit" value={suLoading ? 'Creating…' : 'Create Account'} disabled={suLoading} />

                <p className="auth-switch">Already have an account? <button type="button" onClick={() => setTab('signin')}>Sign in</button></p>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
