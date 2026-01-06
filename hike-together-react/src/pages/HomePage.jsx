import { useState, useEffect } from 'react';
import { getHikes, addHike, canAddHike } from '../services/hikes';
import { checkForNewBadges } from '../services/badges';
import HikeCard from '../components/HikeCard';
import BadgeCelebration from '../components/BadgeCelebration';
import PaywallModal from '../components/PaywallModal';
import { COLORS } from '../utils/constants';

export default function HomePage({ family, user, onShowBadges, onShowSettings }) {
  const [hikes, setHikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
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
    const result = await addHike(family.id, user.uid, hikeData, hikeData.photo);

    if (result.success) {
      await loadHikes();

      // Check for new badges
      const badgeResult = await checkForNewBadges(family.id, hikes.length + 1);
      if (badgeResult.success && badgeResult.newBadges.length > 0) {
        setNewBadge(badgeResult.newBadges[0]); // Show first badge
      }

      setShowForm(false);
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
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{family.name}</h1>
          <p style={styles.subtitle}>{hikes.length} hikes logged</p>
        </div>
        <button onClick={onShowSettings} style={styles.settingsButton}>
          ⚙️
        </button>
      </div>

      <div style={styles.tabs}>
        <button style={styles.tabActive}>🥾 Hikes</button>
        <button style={styles.tab} onClick={onShowBadges}>
          🏆 Badges
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
            <HikeCard key={hike.id} hike={hike} onClick={() => {}} />
          ))
        )}
      </div>

      {showForm && (
        <HikeForm
          onSubmit={handleHikeSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {newBadge && (
        <BadgeCelebration
          badge={newBadge}
          onClose={() => setNewBadge(null)}
        />
      )}

      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onUpgrade={handleUpgrade}
          hikesThisMonth={canAdd.count || 0}
        />
      )}
    </div>
  );
}

function HikeForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    distance: '',
    elevation: '',
    difficulty: 'easy',
    notes: '',
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.formModal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.formTitle}>Add New Hike</h2>

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

          <div style={styles.row}>
            <input
              type="number"
              placeholder="Distance (mi)"
              value={formData.distance}
              onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
              style={{...styles.input, flex: 1}}
              step="0.1"
            />

            <input
              type="number"
              placeholder="Elevation (ft)"
              value={formData.elevation}
              onChange={(e) => setFormData({ ...formData, elevation: e.target.value })}
              style={{...styles.input, flex: 1}}
            />
          </div>

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

          <div style={styles.photoInput}>
            <label style={styles.photoLabel}>
              📸 {photoPreview ? 'Change Photo' : 'Add Photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </label>
            {photoPreview && (
              <img src={photoPreview} alt="Preview" style={styles.photoPreview} />
            )}
          </div>

          <div style={styles.buttonRow}>
            <button type="button" onClick={onCancel} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              Add Hike
            </button>
          </div>
        </form>
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
  addButton: {
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
  },
  limitBanner: {
    padding: '10px',
    background: '#fef3c7',
    color: '#92400e',
    borderRadius: '6px',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '20px',
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
    color: COLORS.textLight,
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: COLORS.text,
    margin: '0 0 10px 0',
  },
  emptyText: {
    fontSize: '16px',
    color: COLORS.textLight,
    margin: 0,
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
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 20px 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '6px',
    outline: 'none',
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
    color: COLORS.textLight,
    background: COLORS.background,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  submitButton: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: COLORS.primary,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
