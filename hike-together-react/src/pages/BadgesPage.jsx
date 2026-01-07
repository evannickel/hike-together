import { useState, useEffect } from 'react';
import { getAllBadgesWithStatus, claimBadge } from '../services/badges';
import { getHikes } from '../services/hikes';
import BadgeCard from '../components/BadgeCard';
import { COLORS, BADGE_CATEGORIES } from '../utils/constants';

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

      {/* Category Tabs */}
      <div style={styles.categoryTabs}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={selectedCategory === 'all' ? styles.categoryTabActive : styles.categoryTab}
        >
          <span style={styles.categoryIcon}>🌟</span>
          <span>All</span>
        </button>
        {categoryBadgeCounts.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={selectedCategory === cat.id ? styles.categoryTabActive : styles.categoryTab}
          >
            <span style={styles.categoryIcon}>{cat.icon}</span>
            <span style={styles.categoryName}>{cat.name}</span>
            <span style={styles.categoryCount}>({cat.earned}/{cat.total})</span>
          </button>
        ))}
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
    </div>
  );
}

// Enhanced Badge Card with details
function BadgeDetailCard({ badge, onClaim }) {
  return (
    <div style={{
      ...styles.badgeCard,
      opacity: badge.earned ? 1 : 0.6,
      border: badge.earned ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`,
    }}>
      {/* Badge Icon */}
      <div style={styles.badgeIconLarge}>{badge.icon}</div>

      {/* Badge Name */}
      <div style={styles.badgeName}>{badge.name}</div>

      {/* Badge Description */}
      <div style={styles.badgeDesc}>{badge.desc}</div>

      {/* Progress or Earned Status */}
      {badge.earned ? (
        <div style={styles.earnedBadge}>
          <span style={styles.earnedIcon}>✓</span>
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
                  }} />
                </div>
              )}
            </div>
          )}

          {badge.canClaim && (
            <button
              onClick={() => onClaim(badge.id)}
              style={styles.claimButton}
            >
              Claim Badge
            </button>
          )}
        </>
      )}

      {/* Badge Type Tag */}
      <div style={styles.badgeType}>
        {BADGE_CATEGORIES.find(c => c.id === badge.type)?.name || badge.type}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
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
  categoryTabs: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    marginBottom: '25px',
    paddingBottom: '10px',
  },
  categoryTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 14px',
    background: 'white',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    fontSize: '13px',
    color: COLORS.text,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  categoryTabActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 14px',
    background: COLORS.primary,
    border: `1px solid ${COLORS.primary}`,
    borderRadius: '8px',
    fontSize: '13px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  categoryIcon: {
    fontSize: '16px',
  },
  categoryName: {
    fontSize: '13px',
  },
  categoryCount: {
    fontSize: '12px',
    opacity: 0.8,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  badgeCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    position: 'relative',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  badgeIconLarge: {
    fontSize: '64px',
    marginBottom: '12px',
  },
  badgeName: {
    fontSize: '18px',
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: '8px',
  },
  badgeDesc: {
    fontSize: '13px',
    color: COLORS.textLight,
    marginBottom: '12px',
    minHeight: '40px',
  },
  earnedBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: `${COLORS.primary}15`,
    padding: '8px',
    borderRadius: '6px',
    marginTop: '10px',
  },
  earnedIcon: {
    fontSize: '16px',
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  earnedText: {
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.primary,
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
