import { COLORS, DIFFICULTY_LEVELS } from '../utils/constants';

export default function HikeCard({ hike, onEdit, onDelete }) {
  const difficultyColor = DIFFICULTY_LEVELS.find(d => d.value === hike.difficulty)?.color || COLORS.textLight;

  return (
    <div style={styles.card}>
      {hike.photoUrl && (
        <img src={hike.photoUrl} alt={hike.name} style={styles.photo} />
      )}

      <div style={styles.content}>
        <div style={styles.header}>
          <h3 style={styles.name}>{hike.name}</h3>
          <div style={styles.actions}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              style={styles.editButton}
              title="Edit hike"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              style={styles.deleteButton}
              title="Delete hike"
            >
              🗑️
            </button>
          </div>
        </div>

        <div style={styles.meta}>
          <span style={styles.date}>📅 {new Date(hike.date).toLocaleDateString()}</span>
          <span style={{...styles.difficulty, background: difficultyColor}}>
            {hike.difficulty}
          </span>
        </div>

        {hike.location && (
          <div style={styles.location}>📍 {hike.location}</div>
        )}

        <div style={styles.stats}>
          {hike.distance && (
            <span style={styles.stat}>🥾 {hike.distance} mi</span>
          )}
          {hike.elevation && (
            <span style={styles.stat}>⛰️ {hike.elevation} ft</span>
          )}
        </div>

        {hike.notes && (
          <p style={styles.notes}>{hike.notes}</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  photo: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  content: {
    padding: '16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  name: {
    fontSize: '20px',
    fontWeight: '600',
    color: COLORS.text,
    margin: 0,
    flex: 1,
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  editButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '4px',
    opacity: 0.6,
    transition: 'opacity 0.2s',
    ':hover': {
      opacity: 1,
    },
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '4px',
    opacity: 0.6,
    transition: 'opacity 0.2s',
    ':hover': {
      opacity: 1,
    },
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  date: {
    fontSize: '14px',
    color: COLORS.textLight,
  },
  difficulty: {
    fontSize: '12px',
    padding: '4px 8px',
    borderRadius: '4px',
    color: 'white',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  location: {
    fontSize: '14px',
    color: COLORS.textLight,
    marginBottom: '8px',
  },
  stats: {
    display: 'flex',
    gap: '15px',
    marginBottom: '8px',
  },
  stat: {
    fontSize: '14px',
    color: COLORS.text,
  },
  notes: {
    fontSize: '14px',
    color: COLORS.textLight,
    margin: '8px 0 0 0',
    lineHeight: '1.5',
  },
};
