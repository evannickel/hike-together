import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { COLORS } from '../utils/constants';

export default function HikeCelebration({ hike, badgesEarned = [], onClose }) {
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
    background: COLORS.paper.offWhite,
    borderRadius: '4px',
    padding: '40px 30px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    animation: 'slideUp 0.4s ease-out',
    border: `3px solid ${COLORS.ink.dark}`,
    boxShadow: `4px 4px 12px ${COLORS.paper.shadow}60`,
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
    fontSize: '38px',
    fontWeight: '700',
    color: COLORS.ink.black,
    margin: '0 0 10px 0',
    fontFamily: "'Just Another Hand', cursive",
  },
  hikeName: {
    fontSize: '24px',
    fontWeight: '600',
    color: COLORS.pencil.forestGreen,
    margin: 0,
    fontFamily: "'Just Another Hand', cursive",
  },
  badgesSection: {
    marginBottom: '25px',
  },
  badgesHeader: {
    fontSize: '24px',
    fontWeight: '700',
    color: COLORS.ink.black,
    textAlign: 'center',
    marginBottom: '15px',
    fontFamily: "'Just Another Hand', cursive",
  },
  badgesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '15px',
  },
  badge: {
    background: COLORS.paper.offWhite,
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center',
    border: `3px dashed ${COLORS.pencil.forestGreen}80`,
    boxShadow: `
      3px 3px 6px ${COLORS.paper.shadow}60,
      inset 0 0 30px ${COLORS.wash.green}
    `,
  },
  badgeIcon: {
    fontSize: '40px',
    marginBottom: '8px',
  },
  badgeName: {
    fontSize: '12px',
    fontWeight: '600',
    color: COLORS.ink.black,
    fontFamily: "'Open Sans', sans-serif",
  },
  button: {
    width: '100%',
    padding: '16px',
    fontSize: '18px',
    fontWeight: '600',
    color: COLORS.paper.offWhite,
    background: COLORS.pencil.forestGreen,
    border: `2px solid ${COLORS.ink.dark}`,
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    fontFamily: "'Open Sans', sans-serif",
    boxShadow: `2px 2px 0 ${COLORS.ink.dark}40`,
  },
};
