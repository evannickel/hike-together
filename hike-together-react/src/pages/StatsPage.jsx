import { useState, useEffect } from 'react';
import { getHikes } from '../services/hikes';
import { getAllBadgesWithStatus } from '../services/badges';
import { getFamilyProgress } from '../services/gamification';
import Footer from '../components/Footer';
import { COLORS, LEVELS, getLevelFromXP, getXPForNextLevel, BADGE_CATEGORIES } from '../utils/constants';

export default function StatsPage({ family, onShowHikes, onShowBadges, onShowSettings }) {
  const [hikes, setHikes] = useState([]);
  const [badges, setBadges] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(LEVELS[0]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHikes: 0,
    totalDistance: 0,
    totalElevation: 0,
    longestHike: 0,
    highestElevation: 0,
  });

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

    // Load XP/Level
    const progressResult = await getFamilyProgress(family.id);
    if (progressResult.success) {
      setTotalXP(progressResult.totalXP);
      setCurrentLevel(progressResult.currentLevel);
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
  const xpForNext = getXPForNextLevel(totalXP);
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  const progress = nextLevel ? ((totalXP - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100 : 100;

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
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📊 Family Stats</h1>
          <p style={styles.subtitle}>{family.name}</p>
        </div>
        <button onClick={onShowSettings} style={styles.settingsButton}>
          ⚙️
        </button>
      </div>

      <div style={styles.tabs}>
        <button style={styles.tab} onClick={onShowHikes}>🥾 Hikes</button>
        <button style={styles.tab} onClick={onShowBadges}>🏆 Badges</button>
        <button style={styles.tabActive}>📊 Stats</button>
      </div>

      {/* Level & XP Card */}
      <div style={styles.levelCard}>
        <div style={styles.levelHeader}>
          <div style={styles.levelIcon}>{currentLevel.icon}</div>
          <div>
            <div style={styles.levelName}>{currentLevel.name}</div>
            <div style={styles.levelNumber}>Level {currentLevel.level}</div>
          </div>
        </div>

        <div style={styles.xpInfo}>
          <div style={styles.xpText}>
            <span>{totalXP.toLocaleString()} XP</span>
            {nextLevel && <span style={styles.xpNext}>{xpForNext} XP to Level {nextLevel.level}</span>}
          </div>
          {nextLevel && (
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${progress}%`}} />
            </div>
          )}
        </div>
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
          <div style={styles.statValue}>{stats.totalDistance}</div>
          <div style={styles.statLabel}>Miles Hiked</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>⛰️</div>
          <div style={styles.statValue}>{stats.totalElevation.toLocaleString()}</div>
          <div style={styles.statLabel}>Feet Climbed</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>🏆</div>
          <div style={styles.statValue}>{earnedBadges.length}/{badges.length}</div>
          <div style={styles.statLabel}>Badges Earned</div>
        </div>
      </div>

      {/* Personal Records */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🌟 Personal Records</h2>
        <div style={styles.recordsGrid}>
          <div style={styles.recordCard}>
            <div style={styles.recordLabel}>Longest Hike</div>
            <div style={styles.recordValue}>{stats.longestHike} mi</div>
          </div>
          <div style={styles.recordCard}>
            <div style={styles.recordLabel}>Highest Elevation</div>
            <div style={styles.recordValue}>{stats.highestElevation} ft</div>
          </div>
        </div>
      </div>

      {/* Badge Progress by Category */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🏅 Badge Progress</h2>
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
    maxWidth: '800px',
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
  levelCard: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    borderRadius: '16px',
    padding: '25px',
    marginBottom: '20px',
    color: 'white',
  },
  levelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '20px',
  },
  levelIcon: {
    fontSize: '48px',
  },
  levelName: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '5px',
  },
  levelNumber: {
    fontSize: '16px',
    opacity: 0.9,
  },
  xpInfo: {
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '15px',
  },
  xpText: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    fontSize: '16px',
    fontWeight: '600',
  },
  xpNext: {
    opacity: 0.9,
    fontSize: '14px',
  },
  progressBar: {
    height: '10px',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'white',
    borderRadius: '5px',
    transition: 'width 0.5s ease',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginBottom: '30px',
  },
  statCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    border: `1px solid ${COLORS.border}`,
  },
  statIcon: {
    fontSize: '32px',
    marginBottom: '10px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '14px',
    color: COLORS.textLight,
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: '15px',
  },
  recordsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
  },
  recordCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    border: `1px solid ${COLORS.border}`,
  },
  recordLabel: {
    fontSize: '14px',
    color: COLORS.textLight,
    marginBottom: '8px',
  },
  recordValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  categoryCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '15px',
    border: `1px solid ${COLORS.border}`,
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
    color: COLORS.text,
  },
  categoryProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  categoryBar: {
    flex: 1,
    height: '8px',
    background: COLORS.background,
    borderRadius: '4px',
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  categoryCount: {
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.textLight,
    minWidth: '50px',
    textAlign: 'right',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: COLORS.textLight,
  },
};
