import { COLORS, DIFFICULTY_LEVELS } from '../utils/constants';
import { formatDistance, formatElevation } from '../utils/units';

export default function HikeCard({ hike, onEdit, onDelete, unitSystem = 'imperial' }) {
  const difficultyColor = DIFFICULTY_LEVELS.find(d => d.value === hike.difficulty)?.color || COLORS.textLight;

  return (
    <div style={styles.card}>
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
            <span style={styles.stat}>🥾 {formatDistance(hike.distance, unitSystem)}</span>
          )}
          {hike.elevation && (
            <span style={styles.stat}>⛰️ {formatElevation(hike.elevation, unitSystem)}</span>
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
    background: COLORS.paper.offWhite,
    borderRadius: '4px',
    border: `2px solid ${COLORS.ink.light}60`,
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: `2px 2px 4px ${COLORS.paper.shadow}40`,
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
    fontSize: '24px',
    fontWeight: '600',
    color: COLORS.ink.black,
    margin: 0,
    flex: 1,
    fontFamily: "'Caveat', cursive",
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
    color: COLORS.ink.medium,
    fontFamily: "'Open Sans', sans-serif",
  },
  difficulty: {
    fontSize: '12px',
    padding: '4px 8px',
    borderRadius: '3px',
    color: COLORS.paper.offWhite,
    fontWeight: '600',
    textTransform: 'capitalize',
    fontFamily: "'Open Sans', sans-serif",
    border: `1px solid ${COLORS.ink.dark}40`,
  },
  location: {
    fontSize: '14px',
    color: COLORS.ink.medium,
    marginBottom: '8px',
    fontFamily: "'Open Sans', sans-serif",
  },
  stats: {
    display: 'flex',
    gap: '15px',
    marginBottom: '8px',
  },
  stat: {
    fontSize: '14px',
    color: COLORS.ink.black,
    fontFamily: "'Open Sans', sans-serif",
  },
  notes: {
    fontSize: '14px',
    color: COLORS.ink.medium,
    margin: '8px 0 0 0',
    lineHeight: '1.5',
    fontFamily: "'Open Sans', sans-serif",
    fontStyle: 'italic',
  },
};
