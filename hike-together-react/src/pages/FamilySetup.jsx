import { useState } from 'react';
import { createFamily, joinFamily } from '../services/family';
import { COLORS } from '../utils/constants';

export default function FamilySetup({ user, onFamilyCreated }) {
  const [isJoining, setIsJoining] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateFamily = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await createFamily(user.uid, familyName);

    if (result.success) {
      onFamilyCreated(result.familyId);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleJoinFamily = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await joinFamily(user.uid, inviteCode);

    if (result.success) {
      onFamilyCreated(result.familyId);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>🏔️ Welcome to Hike Together!</h1>
          <p style={styles.subtitle}>
            {isJoining
              ? 'Join your family to start tracking hikes together'
              : 'Create a family to get started'}
          </p>
        </div>

        {!isJoining ? (
          <form onSubmit={handleCreateFamily} style={styles.form}>
            <input
              type="text"
              placeholder="Family Name (e.g., The Smith Family)"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              required
              style={styles.input}
            />

            {error && <div style={styles.error}>{error}</div>}

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Creating...' : 'Create Family'}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsJoining(true);
                setError('');
              }}
              style={styles.linkButton}
            >
              Already have an invite code? Join Family
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoinFamily} style={styles.form}>
            <input
              type="text"
              placeholder="Invite Code (e.g., ABC123)"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              required
              style={styles.input}
              maxLength={6}
            />

            {error && <div style={styles.error}>{error}</div>}

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Joining...' : 'Join Family'}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsJoining(false);
                setError('');
              }}
              style={styles.linkButton}
            >
              Want to create a new family instead?
            </button>
          </form>
        )}
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
    fontSize: '28px',
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
  linkButton: {
    background: 'none',
    border: 'none',
    color: COLORS.primary,
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'underline',
    padding: '8px',
  },
  error: {
    padding: '12px',
    background: '#fee2e2',
    color: '#991b1b',
    borderRadius: '8px',
    fontSize: '14px',
  },
};
