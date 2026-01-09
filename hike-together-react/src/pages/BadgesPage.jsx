import { useState, useEffect } from 'react';
import { getAllBadgesWithStatus, claimBadge } from '../services/badges';
import { getHikes } from '../services/hikes';
import BadgeCard from '../components/BadgeCard';
import Footer from '../components/Footer';
import { PageDoodles } from '../components/NatureDoodles';
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
      <PageDoodles density="medium" />
      <div style={styles.header}>
        <div style={styles.tabs}>
          <button style={styles.tab} onClick={onShowHikes}>
            Hikes
          </button>
          <button style={styles.tabActive}>Badges</button>
          <button style={styles.tab} onClick={onShowStats}>
            Stats
          </button>
        </div>
        <button onClick={onShowSettings} style={styles.settingsButton}>
          ⚙️
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
          <option value="all">All Badges</option>
          {categoryBadgeCounts.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.earned}/{cat.total})
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
        position: 'relative',  // For absolute positioned corner accent
        display: 'flex',
        flexDirection: 'column',
        opacity: badge.earned ? 1 : 0.7,
        background: badge.earned
          ? COLORS.paper.offWhite
          : COLORS.paper.cream,
        border: badge.earned
          ? `3px dashed ${category?.color || COLORS.pencil.forestGreen}80`
          : `3px dashed ${COLORS.ink.light}60`,
        boxShadow: badge.earned
          ? `
            3px 3px 6px ${COLORS.paper.shadow}60,
            inset 0 0 40px ${category?.wash || COLORS.wash.green},
            0 0 0 1px ${category?.color}30
          `
          : `
            2px 2px 4px ${COLORS.paper.shadow}40,
            inset 0 0 20px ${COLORS.paper.aged}30
          `,
      }}
      className="fadeIn"
    >
      {/* Decorative corner accent for earned badges */}
      {badge.earned && (
        <div style={{
          position: 'absolute',
          top: '-3px',
          right: '-3px',
          width: '40px',
          height: '40px',
          background: `linear-gradient(135deg, ${category?.gradient?.[0]} 0%, ${category?.gradient?.[1]} 100%)`,
          borderRadius: '0 8px 0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `2px solid ${COLORS.ink.dark}`,
          boxShadow: `2px 2px 4px ${COLORS.paper.shadow}60`,
        }}>
          <span style={{ fontSize: '18px' }}>✨</span>
        </div>
      )}

      {/* Top Section: Badge Type Tag */}
      <div style={{
        ...styles.badgeType,
        background: `${category?.color}15`,
        color: category?.color || COLORS.textLight,
        border: `1px solid ${category?.color}30`,
        marginBottom: '12px',  // Space before icon
      }}>
        {category?.name || badge.type}
      </div>

      {/* Icon Section */}
      <div style={{
        ...styles.badgeIconContainer,
        background: badge.earned
          ? category?.wash || COLORS.wash.green
          : COLORS.paper.aged,
        border: badge.earned
          ? `2px dashed ${category?.color}80`
          : `2px dashed ${COLORS.ink.light}50`,
      }}>
        <div style={styles.badgeIconLarge}>{badge.icon}</div>
      </div>

      {/* Text Section: Name and Description */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '12px' }}>
        <div style={styles.badgeName}>{badge.name}</div>
        <div style={styles.badgeDesc}>{badge.desc}</div>
      </div>

      {/* Bottom Section: Progress or Earned Status */}
      <div style={{ marginTop: '8px' }}>
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
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderBottom: `3px solid ${COLORS.ink.light}40`,
  },
  settingsButton: {
    fontSize: '24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    marginBottom: '-3px',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
  },
  tab: {
    ...commonStyles.tab,
  },
  tabActive: {
    ...commonStyles.tab,
    ...commonStyles.tabActive,
  },
  progress: {
    background: COLORS.paper.offWhite,
    padding: '20px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: `2px solid ${COLORS.ink.light}40`,
    boxShadow: `2px 2px 0 ${COLORS.ink.light}20`,
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  progressLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.ink.black,
    fontFamily: "'Just Another Hand', cursive",
    fontSize: '18px',
  },
  progressValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.pencil.forestGreen,
    fontFamily: "'Just Another Hand', cursive",
    fontSize: '18px',
  },
  progressBar: {
    ...commonStyles.trailProgress,
  },
  progressFill: {
    ...commonStyles.trailProgressFill,
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
    background: COLORS.paper.offWhite,
    border: `2px solid ${COLORS.ink.light}60`,
    borderRadius: '4px',
    fontSize: '14px',
    color: COLORS.ink.dark,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: '500',
  },
  filterButtonActive: {
    padding: '10px 16px',
    background: COLORS.pencil.forestGreen,
    border: `2px solid ${COLORS.ink.dark}`,
    borderRadius: '4px',
    fontSize: '14px',
    color: COLORS.paper.offWhite,
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: `2px 2px 0 ${COLORS.ink.dark}40`,
  },
  categoryDropdownContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '25px',
  },
  categoryLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.ink.black,
    fontFamily: "'Just Another Hand', cursive",
  },
  categoryDropdown: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '14px',
    background: COLORS.paper.offWhite,
    border: `2px solid ${COLORS.ink.light}60`,
    borderRadius: '4px',
    color: COLORS.ink.dark,
    cursor: 'pointer',
    outline: 'none',
    fontFamily: "'Open Sans', sans-serif",
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  badgeCard: {
    ...commonStyles.badgeCard,
  },
  badgeIconContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',  // Centered, no bottom margin
    transition: 'all 0.3s ease',
    border: `2px dashed ${COLORS.ink.light}50`,
    background: COLORS.paper.aged,
  },
  badgeIconLarge: {
    fontSize: '48px',
  },
  badgeName: {
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.ink.black,
    marginBottom: '6px',
    fontFamily: "'Just Another Hand', cursive",
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: '12px',
    color: COLORS.ink.medium,
    minHeight: '35px',
    fontFamily: "'Open Sans', sans-serif",
    textAlign: 'center',
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
    color: COLORS.ink.medium,
    marginBottom: '6px',
    fontFamily: "'Open Sans', sans-serif",
  },
  miniProgressBar: {
    height: '6px',
    background: COLORS.paper.aged,
    borderRadius: '2px',
    overflow: 'hidden',
    border: `1px solid ${COLORS.ink.light}30`,
  },
  miniProgressFill: {
    height: '100%',
    background: COLORS.pencil.forestGreen,
    transition: 'width 0.5s ease',
  },
  claimButton: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    background: COLORS.pencil.forestGreen,
    color: COLORS.paper.offWhite,
    border: `2px solid ${COLORS.ink.dark}`,
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: "'Open Sans', sans-serif",
    boxShadow: `2px 2px 0 ${COLORS.ink.dark}40`,
  },
  badgeType: {
    fontSize: '10px',
    padding: '6px 10px',
    background: COLORS.paper.aged,
    borderRadius: '3px',
    color: COLORS.ink.medium,
    fontWeight: '600',
    textTransform: 'uppercase',
    fontFamily: "'Open Sans', sans-serif",
    border: `1px solid ${COLORS.ink.light}40`,
    textAlign: 'center',
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
    color: COLORS.ink.medium,
    fontFamily: "'Open Sans', sans-serif",
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: COLORS.ink.medium,
    fontFamily: "'Open Sans', sans-serif",
  },
  celebration: {
    background: COLORS.paper.offWhite,
    padding: '40px',
    borderRadius: '4px',
    textAlign: 'center',
    marginTop: '30px',
    border: `3px dashed ${COLORS.pencil.forestGreen}80`,
    boxShadow: `
      3px 3px 6px ${COLORS.paper.shadow}60,
      inset 0 0 30px ${COLORS.wash.green}
    `,
  },
  celebrationTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: COLORS.pencil.forestGreen,
    margin: '0 0 10px 0',
    fontFamily: "'Just Another Hand', cursive",
  },
  celebrationText: {
    fontSize: '16px',
    color: COLORS.ink.medium,
    margin: 0,
    fontFamily: "'Open Sans', sans-serif",
  },
};
