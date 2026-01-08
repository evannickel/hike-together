import { useState, useEffect } from 'react';
import { getHikes, addHike, updateHike, deleteHike, canAddHike } from '../services/hikes';
import { checkForNewBadges, claimBadge } from '../services/badges';
import HikeCard from '../components/HikeCard';
import HikeCelebration from '../components/HikeCelebration';
import PaywallModal from '../components/PaywallModal';
import Footer from '../components/Footer';
import { PageDoodles } from '../components/NatureDoodles';
import { HandwrittenNote } from '../components/FieldAnnotations';
import { COLORS, BADGES, BADGE_CATEGORIES, SHADOWS, RADIUS, SPACING } from '../utils/constants';
import { kmToMiles, metersToFeet, getDistancePlaceholder, getElevationPlaceholder } from '../utils/units';
import { commonStyles, gradients } from '../utils/designSystem';

export default function HomePage({ family, user, onShowBadges, onShowStats, onShowSettings }) {
  const [hikes, setHikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHike, setEditingHike] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [canAdd, setCanAdd] = useState({ allowed: true });

  useEffect(() => {
    loadHikes();
  }, [family.id]);

  const loadHikes = async () => {
    setLoading(true);
    const result = await getHikes(family.id);
    if (result.success) {
      setHikes(result.hikes);
    }
    setLoading(false);
  };

  const handleAddHike = async () => {
    // Check if user can add hike
    const checkResult = await canAddHike(family.id);
    setCanAdd(checkResult);

    if (!checkResult.allowed) {
      setShowPaywall(true);
      return;
    }

    setShowForm(true);
  };

  const handleHikeSubmit = async (hikeData) => {
    let result;

    if (editingHike) {
      // Update existing hike
      result = await updateHike(family.id, editingHike.id, hikeData);
    } else {
      // Add new hike
      result = await addHike(family.id, user.uid, hikeData);
    }

    if (result.success) {
      // Reload hikes
      await loadHikes();

      // Only show celebration for new hikes, not edits
      if (!editingHike) {
        // Get updated hikes list
        const hikesResult = await getHikes(family.id);
        const updatedHikes = hikesResult.success ? hikesResult.hikes : hikes;

        // Check for new automatic badges with all hikes
        const badgeResult = await checkForNewBadges(family.id, updatedHikes);

        // Claim manual badges selected by user
        const claimedBadges = [];
        if (hikeData.selectedBadges && hikeData.selectedBadges.length > 0) {
          for (const badgeId of hikeData.selectedBadges) {
            const claimResult = await claimBadge(family.id, badgeId);
            if (claimResult.success && claimResult.badge) {
              claimedBadges.push(claimResult.badge);
            }
          }
        }

        // Combine automatic and manually claimed badges
        const allNewBadges = [
          ...(badgeResult.success ? badgeResult.newBadges : []),
          ...claimedBadges,
        ];

        // Show celebration with all the data
        setCelebration({
          hike: {
            ...hikeData,
            name: hikeData.name || 'Your Hike',
          },
          badgesEarned: allNewBadges,
        });
      } else {
        alert('Hike updated successfully!');
      }

      setShowForm(false);
      setEditingHike(null);
    } else {
      alert(result.error || 'Failed to save hike');
    }
  };

  const handleEditHike = (hike) => {
    setEditingHike(hike);
    setShowForm(true);
  };

  const handleDeleteHike = async (hikeId) => {
    if (!window.confirm('Are you sure you want to delete this hike?')) {
      return;
    }

    const result = await deleteHike(family.id, hikeId);
    if (result.success) {
      await loadHikes();
      alert('Hike deleted successfully');
    } else {
      alert(result.error || 'Failed to delete hike');
    }
  };

  const handleUpgrade = () => {
    alert('Stripe integration coming soon! For now, this would redirect to payment page.');
    // TODO: Integrate Stripe Checkout
  };

  if (loading) {
    return <div style={styles.loading}>Loading hikes...</div>;
  }

  return (
    <div style={styles.container}>
      <PageDoodles density="low" />
      <div style={styles.header}>
        <h1 style={styles.title}>Hikes</h1>
        <button onClick={onShowSettings} style={styles.settingsButton}>
          ⚙️
        </button>
      </div>

      <div style={styles.tabs}>
        <button style={styles.tabActive}>Hikes</button>
        <button style={styles.tab} onClick={onShowBadges}>
          Badges
        </button>
        <button style={styles.tab} onClick={onShowStats}>
          Stats
        </button>
      </div>

      <button onClick={handleAddHike} style={styles.addButton}>
        + Add Hike
      </button>

      {!canAdd.isPremium && (
        <div style={styles.limitBanner}>
          {canAdd.count || 0}/{canAdd.limit || 3} free hikes used this month
        </div>
      )}

      <div style={styles.hikeList}>
        {hikes.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🥾</div>
            <h3 style={styles.emptyTitle}>No hikes yet!</h3>
            <p style={styles.emptyText}>
              Start your hiking adventure by adding your first hike
            </p>
          </div>
        ) : (
          hikes.map(hike => (
            <HikeCard
              key={hike.id}
              hike={hike}
              unitSystem={family.unitSystem || 'imperial'}
              onEdit={() => handleEditHike(hike)}
              onDelete={() => handleDeleteHike(hike.id)}
            />
          ))
        )}
      </div>

      {showForm && (
        <HikeForm
          editingHike={editingHike}
          unitSystem={family.unitSystem || 'imperial'}
          onSubmit={handleHikeSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingHike(null);
          }}
        />
      )}

      {celebration && (
        <HikeCelebration
          hike={celebration.hike}
          badgesEarned={celebration.badgesEarned}
          onClose={() => setCelebration(null)}
        />
      )}

      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onUpgrade={handleUpgrade}
          hikesThisMonth={canAdd.count || 0}
        />
      )}

      <Footer />
    </div>
  );
}

function HikeForm({ editingHike, unitSystem = 'imperial', onSubmit, onCancel }) {
  const [formData, setFormData] = useState(editingHike ? {
    name: editingHike.name || '',
    date: editingHike.date || new Date().toISOString().split('T')[0],
    location: editingHike.location || '',
    distance: editingHike.distance || '',
    elevation: editingHike.elevation || '',
    difficulty: editingHike.difficulty || 'easy',
    notes: editingHike.notes || '',
  } : {
    name: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    distance: '',
    elevation: '',
    difficulty: 'easy',
    notes: '',
  });

  const [selectedBadges, setSelectedBadges] = useState([]);

  // Get claimable badges (manual claim types)
  const claimableBadges = BADGES.filter(badge =>
    ['weather', 'discovery', 'location', 'special', 'holiday'].includes(badge.type)
  );

  // Group badges by category
  const badgesByCategory = {};
  claimableBadges.forEach(badge => {
    if (!badgesByCategory[badge.type]) {
      badgesByCategory[badge.type] = [];
    }
    badgesByCategory[badge.type].push(badge);
  });

  const toggleBadge = (badgeId) => {
    setSelectedBadges(prev =>
      prev.includes(badgeId)
        ? prev.filter(id => id !== badgeId)
        : [...prev, badgeId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert metric to imperial if needed (we store everything in imperial)
    const submitData = { ...formData };
    if (unitSystem === 'metric') {
      if (submitData.distance) {
        submitData.distance = kmToMiles(parseFloat(submitData.distance)).toFixed(2);
      }
      if (submitData.elevation) {
        submitData.elevation = Math.round(metersToFeet(parseFloat(submitData.elevation)));
      }
    }

    onSubmit({ ...submitData, selectedBadges });
  };

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.formModal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.formTitle}>{editingHike ? 'Edit Hike' : 'Add New Hike'}</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Hike Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={styles.input}
          />

          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            style={styles.input}
          />

          <input
            type="number"
            placeholder={getDistancePlaceholder(unitSystem)}
            value={formData.distance}
            onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
            style={styles.input}
            step="0.1"
          />

          <input
            type="number"
            placeholder={getElevationPlaceholder(unitSystem)}
            value={formData.elevation}
            onChange={(e) => setFormData({ ...formData, elevation: e.target.value })}
            style={styles.input}
          />

          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            style={styles.input}
          >
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="hard">Hard</option>
          </select>

          <textarea
            placeholder="Notes about the hike..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            style={{...styles.input, minHeight: '80px'}}
          />

          {/* Badge Selection Section */}
          <div style={styles.badgeSection}>
            <h3 style={styles.badgeSectionTitle}>
              🏆 {editingHike ? 'Claim any new badges from this hike?' : 'Did you earn any special badges on this hike?'}
            </h3>
            <p style={styles.badgeSectionSubtitle}>
              Select all that apply (optional)
            </p>

            {Object.entries(badgesByCategory).map(([type, badges]) => {
              const category = BADGE_CATEGORIES.find(c => c.id === type);
              return (
                <div key={type} style={styles.badgeCategory}>
                  <div style={styles.badgeCategoryHeader}>
                    <span style={styles.badgeCategoryIcon}>{category?.icon}</span>
                    <span style={styles.badgeCategoryName}>{category?.name}</span>
                  </div>
                  <div style={styles.badgeGrid}>
                    {badges.map(badge => (
                      <label key={badge.id} style={styles.badgeCheckbox}>
                        <input
                          type="checkbox"
                          checked={selectedBadges.includes(badge.id)}
                          onChange={() => toggleBadge(badge.id)}
                          style={styles.checkbox}
                        />
                        <span style={styles.badgeIcon}>{badge.icon}</span>
                        <span style={styles.badgeLabel}>{badge.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}

            {selectedBadges.length > 0 && (
              <div style={styles.selectedBadgesCount}>
                {selectedBadges.length} badge{selectedBadges.length !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>

          <div style={styles.buttonRow}>
            <button type="button" onClick={onCancel} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              {editingHike ? 'Update Hike' : 'Add Hike'}
            </button>
          </div>
        </form>
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
  },
  subtitle: {
    fontSize: '16px',
    color: COLORS.ink.medium,
    margin: 0,
    fontWeight: '500',
    fontFamily: "'Open Sans', sans-serif",
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
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    borderBottom: `3px solid ${COLORS.ink.light}40`,
  },
  tab: {
    ...commonStyles.tab,
  },
  tabActive: {
    ...commonStyles.tab,
    ...commonStyles.tabActive,
  },
  addButton: {
    width: '100%',
    ...commonStyles.button,
    ...commonStyles.buttonPrimary,
    marginBottom: SPACING.sm,
  },
  limitBanner: {
    padding: '10px',
    background: COLORS.wash.yellow,
    color: COLORS.pencil.earthBrown,
    borderRadius: '4px',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '20px',
    border: `2px dashed ${COLORS.pencil.sunYellow}80`,
    fontFamily: "'Open Sans', sans-serif",
  },
  hikeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
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
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    background: COLORS.paper.offWhite,
    borderRadius: '4px',
    border: `2px dashed ${COLORS.ink.light}60`,
    boxShadow: `2px 2px 4px ${COLORS.paper.shadow}40`,
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: COLORS.ink.black,
    margin: '0 0 10px 0',
    fontFamily: "'Caveat', cursive",
  },
  emptyText: {
    fontSize: '16px',
    color: COLORS.ink.medium,
    margin: 0,
    fontFamily: "'Open Sans', sans-serif",
  },
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
  formModal: {
    background: COLORS.paper.offWhite,
    borderRadius: '4px',
    padding: '30px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    border: `3px solid ${COLORS.ink.dark}`,
    boxShadow: `4px 4px 8px ${COLORS.paper.shadow}60`,
  },
  formTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: COLORS.ink.black,
    margin: '0 0 20px 0',
    fontFamily: "'Caveat', cursive",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: `2px solid ${COLORS.ink.light}60`,
    borderRadius: '4px',
    outline: 'none',
    background: COLORS.paper.cream,
    color: COLORS.ink.black,
    fontFamily: "'Open Sans', sans-serif",
    transition: 'border-color 0.2s',
  },
  row: {
    display: 'flex',
    gap: '10px',
  },
  photoInput: {
    marginTop: '10px',
  },
  photoLabel: {
    display: 'inline-block',
    padding: '10px 20px',
    background: COLORS.background,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  photoPreview: {
    width: '100%',
    maxHeight: '200px',
    objectFit: 'cover',
    borderRadius: '6px',
    marginTop: '10px',
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    color: COLORS.ink.dark,
    background: COLORS.paper.aged,
    border: `2px solid ${COLORS.ink.light}60`,
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.paper.offWhite,
    background: COLORS.pencil.forestGreen,
    border: `2px solid ${COLORS.ink.dark}`,
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: "'Open Sans', sans-serif",
    boxShadow: `2px 2px 0 ${COLORS.ink.dark}40`,
  },
  badgeSection: {
    marginTop: '20px',
    padding: '16px',
    background: COLORS.paper.cream,
    borderRadius: '4px',
    border: `2px dashed ${COLORS.ink.light}60`,
    boxShadow: `inset 0 0 20px ${COLORS.paper.aged}30`,
  },
  badgeSectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: COLORS.ink.black,
    margin: '0 0 5px 0',
    fontFamily: "'Caveat', cursive",
  },
  badgeSectionSubtitle: {
    fontSize: '13px',
    color: COLORS.ink.medium,
    margin: '0 0 15px 0',
    fontFamily: "'Open Sans', sans-serif",
  },
  badgeCategory: {
    marginBottom: '16px',
  },
  badgeCategoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  badgeCategoryIcon: {
    fontSize: '18px',
  },
  badgeCategoryName: {
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.ink.black,
    fontFamily: "'Open Sans', sans-serif",
  },
  badgeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '8px',
  },
  badgeCheckbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px',
    background: COLORS.paper.offWhite,
    border: `2px solid ${COLORS.ink.light}40`,
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  checkbox: {
    cursor: 'pointer',
  },
  badgeIcon: {
    fontSize: '16px',
  },
  badgeLabel: {
    fontSize: '12px',
    color: COLORS.ink.black,
    flex: 1,
    fontFamily: "'Open Sans', sans-serif",
  },
  selectedBadgesCount: {
    marginTop: '12px',
    padding: '8px',
    background: COLORS.wash.green,
    color: COLORS.pencil.forestGreen,
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '600',
    textAlign: 'center',
    border: `2px dashed ${COLORS.pencil.forestGreen}60`,
    fontFamily: "'Caveat', cursive",
    fontSize: '16px',
  },
};
