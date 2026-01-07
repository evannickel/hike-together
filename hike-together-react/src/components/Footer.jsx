import { COLORS } from '../utils/constants';

export default function Footer() {
  return (
    <div style={styles.footer}>
      <p style={styles.footerText}>
        Made with ❤️ for families who love hiking by{' '}
        <a href="https://evannickel.com" target="_blank" rel="noopener noreferrer" style={styles.link}>
          Evan Nickel
        </a>
      </p>
      <p style={styles.footerText}>
        <a href="mailto:evan@evannickel.com" style={styles.link}>Questions?</a>
      </p>
    </div>
  );
}

const styles = {
  footer: {
    textAlign: 'center',
    marginTop: '60px',
    paddingTop: '20px',
    borderTop: `1px solid ${COLORS.border}`,
  },
  footerText: {
    fontSize: '14px',
    color: COLORS.textLight,
    margin: '5px 0',
  },
  link: {
    color: COLORS.primary,
    textDecoration: 'none',
  },
};
