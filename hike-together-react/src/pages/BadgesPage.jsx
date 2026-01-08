import { useState, useEffect } from 'react';
import { getAllBadgesWithStatus, claimBadge } from '../services/badges';
import { getHikes } from '../services/hikes';
import BadgeCard from '../components/BadgeCard';
import Footer from '../components/Footer';
import { COLORS, BADGE_CATEGORIES, SHADOWS, RADIUS, SPACING } from '../utils/constants';
import { commonStyles, topographicPattern, getBadgeCategoryStyle } from '../utils/designSystem';

export default function BadgesPage({ family, onShowHikes, onShowStats, onShowSettings }) {
  const [badges, setBadges] = useState([]);
  const [hikes, setHikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'earned', 'not_earned'

  useEffect(() => {
    loadBadges();
  }, [family.id]);

  const loadBadges = async () => {
    setLoading(true);

    // Get hikes
    const hikesResult = await getHikes(family.id);
    if (hikesResult.success) {
      setHikes(hikesResult.hikes);
    }

    // Get badges with progress
    const result = await getAllBadgesWithStatus(family.id, hikesResult.success ? hikesResult.hikes : []);
    if (result.success) {
      setBadges(result.badges);
    }

    setLoading(false);
  };

  const handleClaimBadge = async (badgeId) => {
    const result = await claimBadge(family.id, badgeId);
    if (result.success) {
      // Reload badges to show the claimed badge
      await loadBadges();
      alert('Badge claimed! 🎉');
    } else {
      alert(result.error || 'Failed to claim badge');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading badges...</div>;
  }

  // Filter badges
  let filteredBadges = badges;

  // Filter by category
  if (selectedCategory !== 'all') {
    filteredBadges = filteredBadges.filter(b => b.type === selectedCategory);
  }

  // Filter by status
  if (filterStatus === 'earned') {
    filteredBadges = filteredBadges.filter(b => b.earned);
  } else if (filterStatus === 'not_earned') {
    filteredBadges = filteredBadges.filter(b => !b.earned);
  }

  const earnedCount = badges.filter(b => b.earned).length;
  const categoryBadgeCounts = BADGE_CATEGORIES.map(cat => ({
    ...cat,
    total: badges.filter(b => b.type === cat.id).length,
    earned: badges.filter(b => b.type === cat.id && b.earned).length,
  }));

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
        <button style={styles.tab} onClick={onShowStats}>
          📊 Stats
        </button>
      </div>

      {/* Overall Progress */}
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

      {/* Status Filter Buttons */}
      <div style={styles.filterSection}>
        <div style={styles.filterButtons}>
          <button
            onClick={() => setFilterStatus('all')}
            style={filterStatus === 'all' ? styles.filterButtonActive : styles.filterButton}
          >
            All Badges
          </button>
          <button
            onClick={() => setFilterStatus('earned')}
            style={filterStatus === 'earned' ? styles.filterButtonActive : styles.filterButton}
          >
            Earned ({earnedCount})
          </button>
          <button
            onClick={() => setFilterStatus('not_earned')}
            style={filterStatus === 'not_earned' ? styles.filterButtonActive : styles.filterButton}
          >
            Not Earned ({badges.length - earnedCount})
          </button>
        </div>
      </div>

      {/* Category Dropdown */}
      <div style={styles.categoryDropdownContainer}>
        <label style={styles.categoryLabel}>Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.categoryDropdown}
        >
          <option value="all">🌟 All Badges</option>
          {categoryBadgeCounts.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name} ({cat.earned}/{cat.total})
            </option>
          ))}
        </select>
      </div>

      {/* Badge Grid */}
      <div style={styles.grid}>
        {filteredBadges.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🏆</div>
            <p style={styles.emptyText}>No badges found in this category</p>
          </div>
        ) : (
          filteredBadges.map(badge => (
            <BadgeDetailCard
              key={badge.id}
              badge={badge}
              onClaim={handleClaimBadge}
            />
          ))
        )}
      </div>

      {earnedCount === badges.length && (
        <div style={styles.celebration}>
          <h2 style={styles.celebrationTitle}>🎉 All badges earned!</h2>
          <p style={styles.celebrationText}>
            Congratulations! You've completed all {badges.length} badges!
          </p>
        </div>
      )}

      <Footer />
    </div>
  );
}

// 🎨 Enhanced Badge Card with Illustrated Style
function BadgeDetailCard({ badge, onClaim }) {
  const category = BADGE_CATEGORIES.find(c => c.id === badge.type);
  const categoryStyle = getBadgeCategoryStyle(category);

  return (
    <div
      style={{
        ...styles.badgeCard,
        opacity: badge.earned ? 1 : 0.7,
        background: badge.earned
          ? `linear-gradient(135deg, white 0%, ${category?.gradient?.[1]}15 100%)`
          : 'white',
        border: badge.earned
          ? `3px solid ${category?.color || COLORS.border}`
          : `2px solid ${COLORS.border}`,
        boxShadow: badge.earned ? SHADOWS.badge : SHADOWS.sm,
      }}
      className="fadeIn"
    >
      {/* Decorative corner accent for earned badges */}
      {badge.earned && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          right: '-2px',
          width: '40px',
          height: '40px',
          background: `linear-gradient(135deg, ${category?.gradient?.[0]} 0%, ${category?.gradient?.[1]} 100%)`,
          borderRadius: '0 14px 0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: SHADOWS.sm,
        }}>
          <span style={{ fontSize: '18px' }}>✨</span>
        </div>
      )}

      {/* Badge Icon with decorative circle background */}
      <div style={{
        ...styles.badgeIconContainer,
        background: badge.earned
          ? `linear-gradient(135deg, ${category?.gradient?.[0]}20 0%, ${category?.gradient?.[1]}20 100%)`
          : `${COLORS.backgroundAlt}`,
        border: badge.earned
          ? `2px solid ${category?.color}40`
          : `2px solid ${COLORS.border}`,
      }}>
        <div style={styles.badgeIconLarge}>{badge.icon}</div>
      </div>

      {/* Badge Name */}
      <div style={styles.badgeName}>{badge.name}</div>

      {/* Badge Description */}
      <div style={styles.badgeDesc}>{badge.desc}</div>

      {/* Progress or Earned Status */}
      {badge.earned ? (
        <div style={{
          ...styles.earnedBadge,
          ...categoryStyle,
        }}>
          <span style={styles.earnedIcon}>🏆</span>
          <span style={styles.earnedText}>Earned!</span>
        </div>
      ) : (
        <>
          {badge.progressText && (
            <div style={styles.progressSection}>
              <div style={styles.progressText}>{badge.progressText}</div>
              {badge.progress > 0 && (
                <div style={styles.miniProgressBar}>
                  <div style={{
                    ...styles.miniProgressFill,
                    width: `${badge.progress}%`,
                    background: `linear-gradient(90deg, ${category?.gradient?.[0]} 0%, ${category?.gradient?.[1]} 100%)`,
                  }} />
                </div>
              )}
            </div>
          )}

          {badge.canClaim && (
            <button
              onClick={() => onClaim(badge.id)}
              style={{
                ...styles.claimButton,
                ...categoryStyle,
              }}
            >
              Claim Badge
            </button>
          )}
        </>
      )}

      {/* Badge Type Tag */}
      <div style={{
        ...styles.badgeType,
        background: `${category?.color}15`,
        color: category?.color || COLORS.textLight,
        border: `1px solid ${category?.color}30`,
      }}>
        {category?.icon} {category?.name || badge.type}
      </div>
    </div>
  );
}

const styles = {
  container: {
    ...commonStyles.pageContainer,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  title: {
    ...commonStyles.heading,
    ...commonStyles.headingLarge,
    fontFamily: "'Fredoka', sans-serif",
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
    marginBottom: '20px',
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
  filterSection: {
    marginBottom: '20px',
  },
  filterButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  filterButton: {
    padding: '10px 16px',
    background: 'white',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    color: COLORS.text,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterButtonActive: {
    padding: '10px 16px',
    background: COLORS.primary,
    border: `1px solid ${COLORS.primary}`,
    borderRadius: '8px',
    fontSize: '14px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
  },
  categoryDropdownContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '25px',
  },
  categoryLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.text,
  },
  categoryDropdown: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '14px',
    background: 'white',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    color: COLORS.text,
    cursor: 'pointer',
    outline: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  badgeCard: {
    background: 'white',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    textAlign: 'center',
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  },
  badgeIconContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px auto',
    transition: 'all 0.3s ease',
  },
  badgeIconLarge: {
    fontSize: '48px',
  },
  badgeName: {
    fontSize: '15px',
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: '6px',
  },
  badgeDesc: {
    fontSize: '12px',
    color: COLORS.textLight,
    marginBottom: '10px',
    minHeight: '35px',
  },
  earnedBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: `${SPACING.sm} ${SPACING.md}`,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
    fontWeight: '600',
  },
  earnedIcon: {
    fontSize: '18px',
  },
  earnedText: {
    fontSize: '14px',
    fontWeight: '600',
  },
  progressSection: {
    marginTop: '10px',
  },
  progressText: {
    fontSize: '12px',
    color: COLORS.textLight,
    marginBottom: '6px',
  },
  miniProgressBar: {
    height: '6px',
    background: COLORS.border,
    borderRadius: '3px',
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    background: COLORS.primary,
    transition: 'width 0.5s ease',
  },
  claimButton: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    background: COLORS.secondary,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  badgeType: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '10px',
    padding: '4px 8px',
    background: COLORS.background,
    borderRadius: '4px',
    color: COLORS.textLight,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  empty: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '15px',
  },
  emptyText: {
    fontSize: '16px',
    color: COLORS.textLight,
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
