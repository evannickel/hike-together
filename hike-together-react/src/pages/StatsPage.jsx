import { useState, useEffect } from 'react';
import { getHikes } from '../services/hikes';
import { getAllBadgesWithStatus } from '../services/badges';
import Footer from '../components/Footer';
import { PageDoodles } from '../components/NatureDoodles';
import { formatDistance, formatElevation, getDistanceUnit, getElevationUnit } from '../utils/units';
import { COLORS, BADGE_CATEGORIES, SHADOWS, RADIUS, SPACING } from '../utils/constants';
import { commonStyles, gradients } from '../utils/designSystem';

export default function StatsPage({ family, onShowHikes, onShowBadges, onShowSettings }) {
  const [hikes, setHikes] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHikes: 0,
    totalDistance: 0,
    totalElevation: 0,
    longestHike: 0,
    highestElevation: 0,
  });

  const unitSystem = family.unitSystem || 'imperial';

  useEffect(() => {
    loadStats();
  }, [family.id]);

  const loadStats = async () => {
    setLoading(true);

    // Load hikes
    const hikesResult = await getHikes(family.id);
    if (hikesResult.success) {
      setHikes(hikesResult.hikes);
      calculateStats(hikesResult.hikes);
    }

    // Load badges
    const badgesResult = await getAllBadgesWithStatus(family.id);
    if (badgesResult.success) {
      setBadges(badgesResult.badges);
    }

    setLoading(false);
  };

  const calculateStats = (hikesList) => {
    const totalDistance = hikesList.reduce((sum, h) => sum + (parseFloat(h.distance) || 0), 0);
    const totalElevation = hikesList.reduce((sum, h) => sum + (parseFloat(h.elevation) || 0), 0);
    const longestHike = Math.max(...hikesList.map(h => parseFloat(h.distance) || 0), 0);
    const highestElevation = Math.max(...hikesList.map(h => parseFloat(h.elevation) || 0), 0);

    setStats({
      totalHikes: hikesList.length,
      totalDistance: Math.round(totalDistance * 10) / 10,
      totalElevation: Math.round(totalElevation),
      longestHike: Math.round(longestHike * 10) / 10,
      highestElevation: Math.round(highestElevation),
    });
  };

  const earnedBadges = badges.filter(b => b.earned);

  // Badge stats by category
  const badgesByCategory = BADGE_CATEGORIES.map(category => ({
    ...category,
    total: badges.filter(b => b.type === category.id).length,
    earned: earnedBadges.filter(b => b.type === category.id).length,
  }));

  if (loading) {
    return <div style={styles.loading}>Loading stats...</div>;
  }

  return (
    <div style={styles.container}>
      <PageDoodles density="low" />
      <div style={styles.header}>
        <div style={styles.tabs}>
          <button style={styles.tab} onClick={onShowHikes}>Hikes</button>
          <button style={styles.tab} onClick={onShowBadges}>Badges</button>
          <button style={styles.tabActive}>Stats</button>
        </div>
        <button onClick={onShowSettings} style={styles.settingsButton}>
          ⚙️
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🥾</div>
          <div style={styles.statValue}>{stats.totalHikes}</div>
          <div style={styles.statLabel}>Total Hikes</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>🏃</div>
          <div style={styles.statValue}>{formatDistance(stats.totalDistance, unitSystem)}</div>
          <div style={styles.statLabel}>Distance Hiked</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>⛰️</div>
          <div style={styles.statValue}>{formatElevation(stats.totalElevation, unitSystem)}</div>
          <div style={styles.statLabel}>Elevation Climbed</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>🏆</div>
          <div style={styles.statValue}>{earnedBadges.length}/{badges.length}</div>
          <div style={styles.statLabel}>Badges Earned</div>
        </div>
      </div>

      {/* Personal Records */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Personal Records</h2>
        <div style={styles.recordsGrid}>
          <div style={styles.recordCard}>
            <div style={styles.recordLabel}>Longest Hike</div>
            <div style={styles.recordValue}>{formatDistance(stats.longestHike, unitSystem)}</div>
          </div>
          <div style={styles.recordCard}>
            <div style={styles.recordLabel}>Highest Elevation</div>
            <div style={styles.recordValue}>{formatElevation(stats.highestElevation, unitSystem)}</div>
          </div>
        </div>
      </div>

      {/* Badge Progress by Category */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Badge Progress</h2>
        <div style={styles.categoryList}>
          {badgesByCategory.map(category => (
            <div key={category.id} style={styles.categoryCard}>
              <div style={styles.categoryHeader}>
                <span style={styles.categoryIcon}>{category.icon}</span>
                <span style={styles.categoryName}>{category.name}</span>
              </div>
              <div style={styles.categoryProgress}>
                <div style={styles.categoryBar}>
                  <div style={{
                    ...styles.categoryBarFill,
                    width: `${(category.earned / category.total) * 100}%`,
                    background: category.color,
                  }} />
                </div>
                <div style={styles.categoryCount}>{category.earned}/{category.total}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
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
    marginBottom: '20px',
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginBottom: '30px',
  },
  statCard: {
    background: COLORS.paper.offWhite,
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    border: `2px dashed ${COLORS.ink.light}60`,
    boxShadow: `
      2px 2px 4px ${COLORS.paper.shadow}40,
      inset 0 0 20px ${COLORS.paper.aged}20
    `,
  },
  statIcon: {
    fontSize: '32px',
    marginBottom: '10px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: COLORS.pencil.forestGreen,
    marginBottom: '5px',
    fontFamily: "'Just Another Hand', cursive",
  },
  statLabel: {
    fontSize: '14px',
    color: COLORS.ink.medium,
    fontFamily: "'Open Sans', sans-serif",
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    ...commonStyles.heading,
    ...commonStyles.headingMedium,
    marginBottom: '15px',
    textAlign: 'center',
  },
  recordsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
  },
  recordCard: {
    background: COLORS.paper.offWhite,
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    border: `2px solid ${COLORS.ink.light}60`,
    boxShadow: `2px 2px 0 ${COLORS.ink.light}20`,
  },
  recordLabel: {
    fontSize: '14px',
    color: COLORS.ink.medium,
    marginBottom: '8px',
    fontFamily: "'Open Sans', sans-serif",
  },
  recordValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: COLORS.pencil.forestGreen,
    fontFamily: "'Just Another Hand', cursive",
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  categoryCard: {
    background: COLORS.paper.offWhite,
    borderRadius: '4px',
    padding: '15px',
    border: `2px solid ${COLORS.ink.light}60`,
    boxShadow: `2px 2px 0 ${COLORS.ink.light}20`,
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  categoryIcon: {
    fontSize: '24px',
  },
  categoryName: {
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.ink.black,
    fontFamily: "'Open Sans', sans-serif",
  },
  categoryProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  categoryBar: {
    ...commonStyles.trailProgress,
    flex: 1,
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.5s ease',
  },
  categoryCount: {
    fontSize: '16px',
    fontWeight: '700',
    color: COLORS.pencil.forestGreen,
    minWidth: '50px',
    textAlign: 'right',
    fontFamily: "'Just Another Hand', cursive",
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
};
