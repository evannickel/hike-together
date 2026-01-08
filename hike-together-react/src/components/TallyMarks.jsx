import { COLORS } from '../utils/constants';

// ✏️ Tally Marks - Hand-drawn counting visualization

export function TallyMarks({ count, style, color = COLORS.ink.dark }) {
  // Group tally marks in groups of 5
  const groups = Math.floor(count / 5);
  const remainder = count % 5;

  const renderTallyGroup = (index) => {
    return (
      <svg
        key={`group-${index}`}
        width="30"
        height="30"
        viewBox="0 0 30 30"
        style={{ margin: '0 4px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Four vertical lines */}
        <line x1="4" y1="5" x2="4" y2="25" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="5" x2="10" y2="25" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="5" x2="16" y2="25" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="5" x2="22" y2="25" stroke={color} strokeWidth="2" strokeLinecap="round" />
        {/* Diagonal crossing line */}
        <line x1="2" y1="8" x2="24" y2="22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  };

  const renderPartialTally = () => {
    if (remainder === 0) return null;

    return (
      <svg
        key="partial"
        width="30"
        height="30"
        viewBox="0 0 30 30"
        style={{ margin: '0 4px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {remainder >= 1 && <line x1="4" y1="5" x2="4" y2="25" stroke={color} strokeWidth="2" strokeLinecap="round" />}
        {remainder >= 2 && <line x1="10" y1="5" x2="10" y2="25" stroke={color} strokeWidth="2" strokeLinecap="round" />}
        {remainder >= 3 && <line x1="16" y1="5" x2="16" y2="25" stroke={color} strokeWidth="2" strokeLinecap="round" />}
        {remainder >= 4 && <line x1="22" y1="5" x2="22" y2="25" stroke={color} strokeWidth="2" strokeLinecap="round" />}
      </svg>
    );
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', ...style }}>
      {Array.from({ length: groups }).map((_, i) => renderTallyGroup(i))}
      {renderPartialTally()}
    </div>
  );
}

// Alternative: Simple dots for smaller numbers
export function CountDots({ count, style, color = COLORS.ink.dark, size = 8 }) {
  const maxDots = 20; // Don't show too many dots
  const dots = Math.min(count, maxDots);
  const showPlus = count > maxDots;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', ...style }}>
      {Array.from({ length: dots }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4" cy="4" r="3" fill={color} opacity="0.8" />
        </svg>
      ))}
      {showPlus && (
        <span style={{ fontSize: '12px', color, fontWeight: 'bold', marginLeft: '2px' }}>
          +{count - maxDots}
        </span>
      )}
    </div>
  );
}

// Mountain peaks for elevation count
export function MountainPeaks({ count, style, color = COLORS.pencil.earthBrown }) {
  const maxPeaks = 10;
  const peaks = Math.min(count, maxPeaks);
  const showPlus = count > maxPeaks;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', ...style }}>
      {Array.from({ length: peaks }).map((_, i) => (
        <svg key={i} width="15" height="20" viewBox="0 0 15 20" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 0 20 L 7.5 5 L 15 20 Z"
            fill={color}
            opacity="0.7"
            stroke={COLORS.ink.medium}
            strokeWidth="1"
          />
          <path
            d="M 5 11 L 7.5 5 L 10 11"
            fill={COLORS.paper.offWhite}
            opacity="0.9"
          />
        </svg>
      ))}
      {showPlus && (
        <span style={{ fontSize: '11px', color, fontWeight: 'bold', marginLeft: '4px' }}>
          +{count - maxPeaks}
        </span>
      )}
    </div>
  );
}

// Footsteps for distance
export function Footsteps({ count, style }) {
  const maxSteps = 8;
  const steps = Math.min(count, maxSteps);
  const showPlus = count > maxSteps;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexWrap: 'wrap', ...style }}>
      {Array.from({ length: steps }).map((_, i) => (
        <svg key={i} width="12" height="16" viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg">
          {/* Simplified boot print */}
          <ellipse cx="6" cy="10" rx="4" ry="5" fill={COLORS.ink.medium} opacity="0.6" />
          <ellipse cx="6" cy="4" rx="3" ry="3" fill={COLORS.ink.medium} opacity="0.6" />
        </svg>
      ))}
      {showPlus && (
        <span style={{ fontSize: '11px', color: COLORS.ink.dark, fontWeight: 'bold', marginLeft: '4px' }}>
          +{count - maxSteps}
        </span>
      )}
    </div>
  );
}
