import { COLORS } from '../utils/constants';

export default function BadgeCard({ badge, totalHikes }) {
  const progress = Math.min((totalHikes / badge.requirement) * 100, 100);
  const hikesRemaining = Math.max(badge.requirement - totalHikes, 0);

  return (
    <div style={{
      ...styles.card,
      opacity: badge.earned ? 1 : 0.6,
      background: badge.earned ? 'white' : COLORS.background,
    }}>
      <div style={styles.emoji}>{badge.emoji}</div>
      <h3 style={styles.name}>{badge.name}</h3>
      <p style={styles.description}>{badge.description}</p>

      {badge.earned ? (
        <div style={styles.earned}>
          <span style={styles.checkmark}>✓</span> Earned!
        </div>
      ) : (
        <div style={styles.progress}>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${progress}%`}} />
          </div>
          <div style={styles.progressText}>
            {hikesRemaining} {hikesRemaining === 1 ? 'hike' : 'hikes'} to go
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    padding: '20px',
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
    textAlign: 'center',
    transition: 'transform 0.2s',
  },
  emoji: {
    fontSize: '48px',
    marginBottom: '10px',
  },
  name: {
    fontSize: '18px',
    fontWeight: '600',
    color: COLORS.text,
    margin: '0 0 8px 0',
  },
  description: {
    fontSize: '14px',
    color: COLORS.textLight,
    margin: '0 0 15px 0',
  },
  earned: {
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.success,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
  },
  checkmark: {
    fontSize: '20px',
  },
  progress: {
    marginTop: '10px',
  },
  progressBar: {
    height: '8px',
    background: COLORS.border,
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    background: COLORS.primary,
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '12px',
    color: COLORS.textLight,
  },
};
