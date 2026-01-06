import { useState } from 'react';
import { signUp, signIn, resetPassword } from '../services/auth';
import { COLORS } from '../utils/constants';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (showReset) {
      const result = await resetPassword(email);
      if (result.success) {
        setMessage('Password reset email sent! Check your inbox.');
        setShowReset(false);
      } else {
        setError(result.error);
      }
    } else if (isSignUp) {
      const result = await signUp(email, password);
      if (!result.success) {
        setError(result.error);
      }
    } else {
      const result = await signIn(email, password);
      if (!result.success) {
        setError(result.error);
      }
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>🥾 Hike Together</h1>
          <p style={styles.subtitle}>Make hiking fun for the whole family</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          {!showReset && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={styles.input}
            />
          )}

          {error && <div style={styles.error}>{error}</div>}
          {message && <div style={styles.message}>{message}</div>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Loading...' : showReset ? 'Reset Password' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          {showReset ? (
            <button
              onClick={() => setShowReset(false)}
              style={styles.link}
            >
              Back to Sign In
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                style={styles.link}
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>

              {!isSignUp && (
                <button
                  onClick={() => setShowReset(true)}
                  style={{...styles.link, marginTop: '10px'}}
                >
                  Forgot Password?
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    padding: '40px',
    maxWidth: '400px',
    width: '100%',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: COLORS.textLight,
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px 16px',
    fontSize: '16px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: COLORS.primary,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  error: {
    padding: '12px',
    background: '#fee2e2',
    color: '#991b1b',
    borderRadius: '8px',
    fontSize: '14px',
  },
  message: {
    padding: '12px',
    background: '#d1fae5',
    color: '#065f46',
    borderRadius: '8px',
    fontSize: '14px',
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  link: {
    background: 'none',
    border: 'none',
    color: COLORS.primary,
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'underline',
  },
};
