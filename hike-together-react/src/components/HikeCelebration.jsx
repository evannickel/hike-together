import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { COLORS, XP_PER_HIKE, XP_PER_MILE, XP_PER_100_FEET_ELEVATION } from '../utils/constants';

export default function HikeCelebration({ hike, xpEarned, badgesEarned = [], leveledUp, newLevel, onClose }) {
  useEffect(() => {
    // Trigger massive confetti celebration
    const duration = 4000;
    const end = Date.now() + duration;

    const colors = ['#166534', '#15803d', '#4ade80', '#86efac', '#fbbf24', '#f59e0b'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Big initial burst
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: colors,
      });
    }, 100);
  }, []);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.celebration}>🎉</div>
          <h1 style={styles.title}>Awesome Hike!</h1>
          <h2 style={styles.hikeName}>{hike.name}</h2>
        </div>

        <div style={styles.xpSection}>
          <div style={styles.xpBadge}>
            <div style={styles.xpIcon}>⭐</div>
            <div>
              <div style={styles.xpAmount}>+{xpEarned} XP</div>
              <div style={styles.xpLabel}>Experience Earned</div>
            </div>
          </div>

          <div style={styles.xpBreakdown}>
            <div style={styles.breakdownItem}>
              <span>Completing hike</span>
              <span>+{XP_PER_HIKE} XP</span>
            </div>
            {hike.distance && (
              <div style={styles.breakdownItem}>
                <span>{hike.distance} miles</span>
                <span>+{Math.floor(hike.distance * XP_PER_MILE)} XP</span>
              </div>
            )}
            {hike.elevation && (
              <div style={styles.breakdownItem}>
                <span>{hike.elevation} ft elevation</span>
                <span>+{Math.floor((hike.elevation / 100) * XP_PER_100_FEET_ELEVATION)} XP</span>
              </div>
            )}
          </div>
        </div>

        {leveledUp && newLevel && (
          <div style={styles.levelUpSection}>
            <div style={styles.levelUpBanner}>
              <div style={styles.levelUpIcon}>🎊 LEVEL UP! 🎊</div>
              <div style={styles.levelUpText}>
                <div style={styles.newLevelNumber}>Level {newLevel.level}</div>
                <div style={styles.newLevelName}>{newLevel.icon} {newLevel.name}</div>
              </div>
            </div>
          </div>
        )}

        {badgesEarned.length > 0 && (
          <div style={styles.badgesSection}>
            <div style={styles.badgesHeader}>New Badges Unlocked!</div>
            <div style={styles.badgesGrid}>
              {badgesEarned.map(badge => (
                <div key={badge.id} style={styles.badge}>
                  <div style={styles.badgeIcon}>{badge.icon}</div>
                  <div style={styles.badgeName}>{badge.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={onClose} style={styles.button}>
          Continue
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px',
  },
  modal: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px 30px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    animation: 'slideUp 0.4s ease-out',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  celebration: {
    fontSize: '80px',
    marginBottom: '10px',
    animation: 'bounce 0.6s ease-in-out infinite',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 10px 0',
  },
  hikeName: {
    fontSize: '20px',
    fontWeight: '600',
    color: COLORS.primary,
    margin: 0,
  },
  xpSection: {
    background: `linear-gradient(135deg, ${COLORS.primary}15 0%, ${COLORS.secondary}15 100%)`,
    borderRadius: '16px',
    padding: '25px',
    marginBottom: '25px',
  },
  xpBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '20px',
    justifyContent: 'center',
  },
  xpIcon: {
    fontSize: '48px',
  },
  xpAmount: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: COLORS.primary,
    lineHeight: 1,
  },
  xpLabel: {
    fontSize: '14px',
    color: COLORS.textLight,
  },
  xpBreakdown: {
    background: 'white',
    borderRadius: '12px',
    padding: '15px',
  },
  breakdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px',
    color: COLORS.text,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  levelUpSection: {
    marginBottom: '25px',
  },
  levelUpBanner: {
    background: `linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)`,
    borderRadius: '16px',
    padding: '25px',
    textAlign: 'center',
  },
  levelUpIcon: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '10px',
    letterSpacing: '2px',
  },
  levelUpText: {
    color: 'white',
  },
  newLevelNumber: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  newLevelName: {
    fontSize: '20px',
    fontWeight: '600',
  },
  badgesSection: {
    marginBottom: '25px',
  },
  badgesHeader: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: '15px',
  },
  badgesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '15px',
  },
  badge: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    borderRadius: '12px',
    padding: '15px',
    textAlign: 'center',
  },
  badgeIcon: {
    fontSize: '40px',
    marginBottom: '8px',
  },
  badgeName: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  button: {
    width: '100%',
    padding: '16px',
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    background: COLORS.primary,
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
};
