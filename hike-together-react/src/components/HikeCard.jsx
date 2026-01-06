import { COLORS, DIFFICULTY_LEVELS } from '../utils/constants';

export default function HikeCard({ hike, onClick }) {
  const difficultyColor = DIFFICULTY_LEVELS.find(d => d.value === hike.difficulty)?.color || COLORS.textLight;

  return (
    <div style={styles.card} onClick={onClick}>
      {hike.photoUrl && (
        <img src={hike.photoUrl} alt={hike.name} style={styles.photo} />
      )}

      <div style={styles.content}>
        <h3 style={styles.name}>{hike.name}</h3>

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
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
  },
  photo: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  content: {
    padding: '16px',
  },
  name: {
    fontSize: '20px',
    fontWeight: '600',
    color: COLORS.text,
    margin: '0 0 12px 0',
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
