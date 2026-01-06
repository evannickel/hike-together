import { useState, useEffect } from 'react';
import { getAllBadgesWithStatus } from '../services/badges';
import { getHikes } from '../services/hikes';
import BadgeCard from '../components/BadgeCard';
import { COLORS } from '../utils/constants';

export default function BadgesPage({ family, onShowHikes, onShowSettings }) {
  const [badges, setBadges] = useState([]);
  const [totalHikes, setTotalHikes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, [family.id]);

  const loadBadges = async () => {
    setLoading(true);

    // Get total hikes
    const hikesResult = await getHikes(family.id);
    if (hikesResult.success) {
      setTotalHikes(hikesResult.hikes.length);
    }

    // Get badges
    const result = await getAllBadgesWithStatus(family.id);
    if (result.success) {
      setBadges(result.badges);
    }

    setLoading(false);
  };

  if (loading) {
    return <div style={styles.loading}>Loading badges...</div>;
  }

  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🏆 Badges</h1>
          <p style={styles.subtitle}>
            {earnedCount} of {badges.length} earned
          </p>
        </div>
        <button onClick={onShowSettings} style={styles.settingsButton}>
          ⚙️
        </button>
      </div>

      <div style={styles.tabs}>
        <button style={styles.tab} onClick={onShowHikes}>
          🥾 Hikes
        </button>
        <button style={styles.tabActive}>🏆 Badges</button>
      </div>

      <div style={styles.progress}>
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>Overall Progress</span>
          <span style={styles.progressValue}>{earnedCount}/{badges.length}</span>
        </div>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${(earnedCount / badges.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div style={styles.grid}>
        {badges.map(badge => (
          <BadgeCard key={badge.id} badge={badge} totalHikes={totalHikes} />
        ))}
      </div>

      {earnedCount === badges.length && (
        <div style={styles.celebration}>
          <h2 style={styles.celebrationTitle}>🎉 All badges earned!</h2>
          <p style={styles.celebrationText}>
            Congratulations! You've completed all {badges.length} badges!
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    minHeight: '100vh',
    background: COLORS.background,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 5px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: COLORS.textLight,
    margin: 0,
  },
  settingsButton: {
    fontSize: '24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    borderBottom: `2px solid ${COLORS.border}`,
  },
  tab: {
    padding: '12px 20px',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: COLORS.textLight,
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
  },
  tabActive: {
    padding: '12px 20px',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: COLORS.primary,
    fontWeight: '600',
    cursor: 'pointer',
    borderBottom: `2px solid ${COLORS.primary}`,
    marginBottom: '-2px',
  },
  progress: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '30px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  progressLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.text,
  },
  progressValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.primary,
  },
  progressBar: {
    height: '12px',
    background: COLORS.border,
    borderRadius: '6px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    transition: 'width 0.5s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '15px',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: COLORS.textLight,
  },
  celebration: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    marginTop: '30px',
  },
  celebrationTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: COLORS.primary,
    margin: '0 0 10px 0',
  },
  celebrationText: {
    fontSize: '16px',
    color: COLORS.textLight,
    margin: 0,
  },
};
