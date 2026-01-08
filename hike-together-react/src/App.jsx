import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { getUserFamily } from './services/family';
import AuthPage from './pages/AuthPage';
import FamilySetup from './pages/FamilySetup';
import HomePage from './pages/HomePage';
import BadgesPage from './pages/BadgesPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [family, setFamily] = useState(null);
  const [loadingFamily, setLoadingFamily] = useState(true);
  const [currentPage, setCurrentPage] = useState('hikes'); // 'hikes', 'badges', 'stats', 'settings'

  useEffect(() => {
    if (user) {
      loadFamily();
    } else {
      setLoadingFamily(false);
    }
  }, [user]);

  const loadFamily = async () => {
    setLoadingFamily(true);
    const result = await getUserFamily(user.uid);

    if (result.success) {
      setFamily(result.family);
    } else {
      setFamily(null);
    }

    setLoadingFamily(false);
  };

  const handleFamilyCreated = () => {
    loadFamily();
  };

  // Loading state
  if (authLoading || (user && loadingFamily)) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingContent}>
          <div style={styles.loadingIcon}>🥾</div>
          <div style={styles.loadingText}>Loading...</div>
        </div>
      </div>
    );
  }

  // Not logged in - show auth page
  if (!user) {
    return <AuthPage />;
  }

  // Logged in but no family - show family setup
  if (!family) {
    return <FamilySetup user={user} onFamilyCreated={handleFamilyCreated} />;
  }

  // Logged in with family - show main app
  return (
    <>
      {currentPage === 'hikes' && (
        <div key="hikes" className="pageFlipIn" style={styles.pageTransition}>
          <HomePage
            family={family}
            user={user}
            onShowBadges={() => setCurrentPage('badges')}
            onShowStats={() => setCurrentPage('stats')}
            onShowSettings={() => setCurrentPage('settings')}
          />
        </div>
      )}

      {currentPage === 'badges' && (
        <div key="badges" className="pageFlipIn" style={styles.pageTransition}>
          <BadgesPage
            family={family}
            onShowHikes={() => setCurrentPage('hikes')}
            onShowStats={() => setCurrentPage('stats')}
            onShowSettings={() => setCurrentPage('settings')}
          />
        </div>
      )}

      {currentPage === 'stats' && (
        <div key="stats" className="pageFlipIn" style={styles.pageTransition}>
          <StatsPage
            family={family}
            onShowHikes={() => setCurrentPage('hikes')}
            onShowBadges={() => setCurrentPage('badges')}
            onShowSettings={() => setCurrentPage('settings')}
          />
        </div>
      )}

      {currentPage === 'settings' && (
        <div key="settings" className="pageFlipIn" style={styles.pageTransition}>
          <SettingsPage
            family={family}
            user={user}
            onShowHikes={() => setCurrentPage('hikes')}
            onShowBadges={() => setCurrentPage('badges')}
            onShowStats={() => setCurrentPage('stats')}
          />
        </div>
      )}
    </>
  );
}

const styles = {
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#f9fafb',
  },
  loadingContent: {
    textAlign: 'center',
  },
  loadingIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '18px',
    color: '#6b7280',
  },
  pageTransition: {
    minHeight: '100vh',
  },
};

export default App;
