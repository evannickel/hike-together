import { useState, useEffect } from 'react';
import { signOut, deleteAccount } from '../services/auth';
import { updateFamilyPreferences, ensureInviteCode } from '../services/family';
import { COLORS, SUBSCRIPTION_PRICE } from '../utils/constants';

export default function SettingsPage({ family, user, onShowHikes, onShowBadges, onShowStats }) {
  const [unitSystem, setUnitSystem] = useState(family.unitSystem || 'imperial');
  const [updating, setUpdating] = useState(false);
  const [inviteCode, setInviteCode] = useState(family.inviteCode || null);

  // Ensure invite code exists when component mounts
  useEffect(() => {
    const checkInviteCode = async () => {
      if (!inviteCode && family.id) {
        const result = await ensureInviteCode(family.id);
        if (result.success) {
          setInviteCode(result.inviteCode);
        }
      }
    };
    checkInviteCode();
  }, [family.id, inviteCode]);

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      window.location.reload();
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone. All your hikes and data will be permanently deleted.'
    );

    if (!confirmed) return;

    const doubleConfirm = window.prompt(
      'Type DELETE to confirm account deletion:'
    );

    if (doubleConfirm !== 'DELETE') {
      alert('Account deletion cancelled');
      return;
    }

    const result = await deleteAccount(user.uid, family.id);
    if (result.success) {
      alert('Your account has been deleted');
      window.location.reload();
    } else {
      alert(result.error || 'Failed to delete account');
    }
  };

  const handleUnitSystemChange = async (newSystem) => {
    setUpdating(true);
    const result = await updateFamilyPreferences(family.id, { unitSystem: newSystem });
    if (result.success) {
      setUnitSystem(newSystem);
      // Reload to apply changes throughout the app
      window.location.reload();
    } else {
      alert(result.error || 'Failed to update preferences');
    }
    setUpdating(false);
  };

  const handleUpgrade = () => {
    alert('Stripe integration coming soon! This would redirect to payment page.');
    // TODO: Integrate Stripe Checkout
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    alert(`Invite code "${inviteCode}" copied to clipboard!`);
  };

  const isPremium = family.subscriptionStatus === 'premium';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>⚙️ Settings</h1>
      </div>

      <div style={styles.tabs}>
        <button style={styles.tab} onClick={onShowHikes}>
          🥾 Hikes
        </button>
        <button style={styles.tab} onClick={onShowBadges}>
          🏆 Badges
        </button>
        <button style={styles.tab} onClick={onShowStats}>
          📊 Stats
        </button>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Family Info</h2>

        <div style={styles.card}>
          <div style={styles.row}>
            <span style={styles.label}>Family Name</span>
            <span style={styles.value}>{family.name}</span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>Invite Code</span>
            <div style={styles.inviteCode}>
              <span style={styles.code}>{inviteCode || 'Generating...'}</span>
              {inviteCode && (
                <button onClick={copyInviteCode} style={styles.copyButton}>
                  📋 Copy
                </button>
              )}
            </div>
          </div>

          <div style={styles.helpText}>
            Share this code with family members so they can join!
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Preferences</h2>

        <div style={styles.card}>
          <div style={styles.preferenceRow}>
            <div>
              <div style={styles.label}>Unit System</div>
              <div style={styles.helpText}>
                Choose how distances and elevations are displayed
              </div>
            </div>
            <div style={styles.unitToggle}>
              <button
                onClick={() => handleUnitSystemChange('imperial')}
                disabled={updating}
                style={{
                  ...styles.unitButton,
                  ...(unitSystem === 'imperial' ? styles.unitButtonActive : {}),
                }}
              >
                Imperial
                <div style={styles.unitExample}>mi / ft</div>
              </button>
              <button
                onClick={() => handleUnitSystemChange('metric')}
                disabled={updating}
                style={{
                  ...styles.unitButton,
                  ...(unitSystem === 'metric' ? styles.unitButtonActive : {}),
                }}
              >
                Metric
                <div style={styles.unitExample}>km / m</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Subscription</h2>

        <div style={styles.card}>
          {isPremium ? (
            <div style={styles.premiumBadge}>
              <span style={styles.premiumIcon}>✨</span>
              <div>
                <div style={styles.premiumText}>Premium Member</div>
                <div style={styles.premiumSubtext}>Unlimited hikes per month</div>
              </div>
            </div>
          ) : (
            <>
              <div style={styles.row}>
                <span style={styles.label}>Current Plan</span>
                <span style={styles.value}>Free (3 hikes/month)</span>
              </div>

              <button onClick={handleUpgrade} style={styles.upgradeButton}>
                Upgrade to Premium - {SUBSCRIPTION_PRICE}
              </button>

              <div style={styles.helpText}>
                Get unlimited hikes, all badges, and support the app!
              </div>
            </>
          )}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Account</h2>

        <div style={styles.card}>
          <div style={styles.row}>
            <span style={styles.label}>Email</span>
            <span style={styles.value}>{user.email}</span>
          </div>

          <button onClick={handleSignOut} style={styles.signOutButton}>
            Sign Out
          </button>

          <div style={styles.dangerZone}>
            <h3 style={styles.dangerZoneTitle}>Danger Zone</h3>
            <p style={styles.dangerZoneText}>
              Once you delete your account, there is no going back. All your hikes will be permanently deleted.
            </p>
            <button onClick={handleDeleteAccount} style={styles.deleteButton}>
              Delete Account
            </button>
          </div>
        </div>
      </div>

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
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    minHeight: '100vh',
    background: COLORS.paper.cream,
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent, transparent 2px, ${COLORS.paper.shadow}10 2px, ${COLORS.paper.shadow}10 3px),
      repeating-linear-gradient(90deg, transparent, transparent 2px, ${COLORS.paper.shadow}08 2px, ${COLORS.paper.shadow}08 3px)
    `,
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    fontSize: '38px',
    fontWeight: '700',
    color: COLORS.ink.black,
    margin: 0,
    fontFamily: "'Caveat', cursive",
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    borderBottom: `3px solid ${COLORS.ink.light}40`,
  },
  tab: {
    padding: '12px 20px',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: COLORS.ink.medium,
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    marginBottom: '-3px',
    fontFamily: "'Open Sans', sans-serif",
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: COLORS.pencil.forestGreen,
    margin: '0 0 12px 0',
    fontFamily: "'Caveat', cursive",
  },
  card: {
    background: COLORS.paper.offWhite,
    padding: '20px',
    borderRadius: '4px',
    border: `2px solid ${COLORS.ink.light}60`,
    boxShadow: `2px 2px 4px ${COLORS.paper.shadow}40`,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: `1px solid ${COLORS.ink.light}40`,
  },
  preferenceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '12px 0',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.ink.black,
    fontFamily: "'Open Sans', sans-serif",
  },
  value: {
    fontSize: '14px',
    color: COLORS.ink.medium,
    fontFamily: "'Open Sans', sans-serif",
  },
  inviteCode: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  code: {
    fontSize: '18px',
    fontWeight: '700',
    color: COLORS.pencil.forestGreen,
    letterSpacing: '2px',
    fontFamily: "'Caveat', cursive",
  },
  copyButton: {
    padding: '6px 12px',
    fontSize: '14px',
    background: COLORS.paper.aged,
    border: `2px solid ${COLORS.ink.light}60`,
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: "'Open Sans', sans-serif",
  },
  helpText: {
    fontSize: '14px',
    color: COLORS.ink.medium,
    marginTop: '12px',
    fontFamily: "'Open Sans', sans-serif",
  },
  unitToggle: {
    display: 'flex',
    gap: '10px',
  },
  unitButton: {
    padding: '10px 16px',
    fontSize: '14px',
    background: COLORS.paper.cream,
    color: COLORS.ink.dark,
    border: `2px solid ${COLORS.ink.light}60`,
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
    fontFamily: "'Open Sans', sans-serif",
  },
  unitButtonActive: {
    background: COLORS.pencil.forestGreen,
    color: COLORS.paper.offWhite,
    border: `2px solid ${COLORS.ink.dark}`,
    fontWeight: '600',
    boxShadow: `2px 2px 0 ${COLORS.ink.dark}40`,
  },
  unitExample: {
    fontSize: '11px',
    marginTop: '4px',
    opacity: 0.8,
  },
  premiumBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    background: COLORS.wash.green,
    borderRadius: '4px',
    border: `3px dashed ${COLORS.pencil.forestGreen}80`,
    boxShadow: `inset 0 0 30px ${COLORS.wash.green}`,
  },
  premiumIcon: {
    fontSize: '32px',
  },
  premiumText: {
    fontSize: '18px',
    fontWeight: '600',
    color: COLORS.pencil.forestGreen,
    fontFamily: "'Caveat', cursive",
  },
  premiumSubtext: {
    fontSize: '14px',
    color: COLORS.ink.medium,
    fontFamily: "'Open Sans', sans-serif",
  },
  upgradeButton: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.paper.offWhite,
    background: COLORS.pencil.forestGreen,
    border: `2px solid ${COLORS.ink.dark}`,
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '12px',
    fontFamily: "'Open Sans', sans-serif",
    boxShadow: `2px 2px 0 ${COLORS.ink.dark}40`,
  },
  signOutButton: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    color: COLORS.ink.dark,
    background: 'transparent',
    border: `2px solid ${COLORS.ink.light}60`,
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '12px',
    fontFamily: "'Open Sans', sans-serif",
  },
  dangerZone: {
    marginTop: '24px',
    padding: '16px',
    background: COLORS.wash.red,
    borderRadius: '4px',
    border: `2px dashed ${COLORS.pencil.berryRed}80`,
    boxShadow: `inset 0 0 20px ${COLORS.wash.red}`,
  },
  dangerZoneTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.pencil.berryRed,
    margin: '0 0 8px 0',
    fontFamily: "'Caveat', cursive",
  },
  dangerZoneText: {
    fontSize: '13px',
    color: COLORS.ink.medium,
    margin: '0 0 12px 0',
    fontFamily: "'Open Sans', sans-serif",
  },
  deleteButton: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.paper.offWhite,
    background: COLORS.pencil.berryRed,
    border: `2px solid ${COLORS.ink.dark}`,
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: "'Open Sans', sans-serif",
    boxShadow: `2px 2px 0 ${COLORS.ink.dark}40`,
  },
  footer: {
    textAlign: 'center',
    marginTop: '60px',
    paddingTop: '20px',
    borderTop: `2px dashed ${COLORS.ink.light}40`,
  },
  footerText: {
    fontSize: '14px',
    color: COLORS.ink.medium,
    margin: '5px 0',
    fontFamily: "'Open Sans', sans-serif",
  },
  link: {
    color: COLORS.pencil.forestGreen,
    textDecoration: 'none',
    fontWeight: '600',
  },
};
