import { COLORS, FREE_HIKE_LIMIT, SUBSCRIPTION_PRICE } from '../utils/constants';

export default function PaywallModal({ onClose, onUpgrade, hikesThisMonth }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>🎒 You've reached your free limit!</h2>
          <p style={styles.subtitle}>
            You've logged {hikesThisMonth} hikes this month. Upgrade to log unlimited hikes!
          </p>
        </div>

        <div style={styles.pricing}>
          <div style={styles.price}>{SUBSCRIPTION_PRICE}</div>
          <ul style={styles.features}>
            <li>✅ Unlimited hikes per month</li>
            <li>✅ All badges unlocked</li>
            <li>✅ Support the app development</li>
            <li>✅ Cancel anytime</li>
          </ul>
        </div>

        <button onClick={onUpgrade} style={styles.upgradeButton}>
          Upgrade Now - {SUBSCRIPTION_PRICE}
        </button>

        <button onClick={onClose} style={styles.cancelButton}>
          Maybe Later
        </button>

        <p style={styles.note}>
          Your free limit resets on the 1st of each month
        </p>
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
    padding: '30px',
    maxWidth: '450px',
    width: '100%',
  },
  header: {
    textAlign: 'center',
    marginBottom: '25px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: COLORS.textLight,
    margin: 0,
  },
  pricing: {
    background: COLORS.background,
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '20px',
  },
  price: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: '20px',
  },
  features: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  upgradeButton: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: COLORS.primary,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '10px',
    transition: 'transform 0.2s',
  },
  cancelButton: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    color: COLORS.textLight,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  note: {
    textAlign: 'center',
    fontSize: '12px',
    color: COLORS.textLight,
    marginTop: '15px',
    marginBottom: 0,
  },
};
