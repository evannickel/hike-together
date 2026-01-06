import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { COLORS } from '../utils/constants';

export default function BadgeCelebration({ badge, onClose }) {
  useEffect(() => {
    if (badge) {
      // Trigger confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#166534', '#15803d', '#4ade80', '#86efac'],
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#166534', '#15803d', '#4ade80', '#86efac'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();

      // Big burst
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#166534', '#15803d', '#4ade80', '#86efac'],
        });
      }, 100);
    }
  }, [badge]);

  if (!badge) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.emojiContainer}>
          <div style={styles.emoji}>{badge.emoji}</div>
        </div>

        <h1 style={styles.title}>🎉 Congratulations! 🎉</h1>
        <h2 style={styles.badgeName}>{badge.name}</h2>
        <p style={styles.description}>{badge.description}</p>

        <button onClick={onClose} style={styles.button}>
          Awesome!
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
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    animation: 'slideUp 0.3s ease-out',
  },
  emojiContainer: {
    marginBottom: '20px',
  },
  emoji: {
    fontSize: '80px',
    animation: 'bounce 0.6s ease-in-out',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 10px 0',
  },
  badgeName: {
    fontSize: '24px',
    fontWeight: '600',
    color: COLORS.primary,
    margin: '0 0 15px 0',
  },
  description: {
    fontSize: '16px',
    color: COLORS.textLight,
    margin: '0 0 30px 0',
  },
  button: {
    padding: '12px 40px',
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    background: COLORS.primary,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
};
