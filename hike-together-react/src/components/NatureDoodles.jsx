import { COLORS } from '../utils/constants';

// 🌿 Nature Doodles - Hand-drawn SVG illustrations for field journal aesthetic

export function LeafDoodle({ style, size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 10 30 Q 15 15, 20 10 Q 25 15, 30 30 Q 25 28, 20 27 Q 15 28, 10 30"
        fill={COLORS.pencil.leafGreen}
        opacity="0.6"
        stroke={COLORS.ink.medium}
        strokeWidth="1"
      />
      <path
        d="M 20 10 L 20 27"
        stroke={COLORS.ink.medium}
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

export function BirdDoodle({ style, size = 50 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simple bird silhouette */}
      <path
        d="M 15 25 Q 20 20, 25 25 Q 30 20, 35 25 Q 25 27, 25 30 Q 25 27, 15 25"
        fill={COLORS.ink.dark}
        opacity="0.7"
      />
      {/* Bird body */}
      <ellipse
        cx="25"
        cy="30"
        rx="6"
        ry="8"
        fill={COLORS.ink.dark}
        opacity="0.7"
      />
    </svg>
  );
}

export function CompassDoodle({ style, size = 45 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 45 45"
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Compass circle */}
      <circle
        cx="22.5"
        cy="22.5"
        r="18"
        fill="none"
        stroke={COLORS.ink.medium}
        strokeWidth="2"
      />
      {/* N marker */}
      <text
        x="22.5"
        y="10"
        textAnchor="middle"
        fontSize="10"
        fontWeight="bold"
        fill={COLORS.pencil.berryRed}
      >
        N
      </text>
      {/* Compass needle */}
      <path
        d="M 22.5 12 L 27 22.5 L 22.5 33 L 18 22.5 Z"
        fill={COLORS.pencil.berryRed}
        opacity="0.8"
      />
      <path
        d="M 22.5 12 L 18 22.5 L 22.5 33 L 27 22.5 Z"
        fill={COLORS.paper.aged}
        opacity="0.6"
      />
    </svg>
  );
}

export function MountainDoodle({ style, size = 60 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Mountain peaks */}
      <path
        d="M 5 45 L 20 15 L 30 30 L 40 10 L 55 45 Z"
        fill={COLORS.pencil.earthBrown}
        opacity="0.5"
        stroke={COLORS.ink.medium}
        strokeWidth="1.5"
      />
      {/* Snow caps */}
      <path
        d="M 17 20 L 20 15 L 23 20 Z"
        fill={COLORS.paper.offWhite}
        opacity="0.9"
      />
      <path
        d="M 37 15 L 40 10 L 43 15 Z"
        fill={COLORS.paper.offWhite}
        opacity="0.9"
      />
    </svg>
  );
}

export function TreeDoodle({ style, size = 45 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 45 45"
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tree trunk */}
      <rect
        x="19"
        y="28"
        width="7"
        height="14"
        fill={COLORS.pencil.earthBrown}
        opacity="0.7"
      />
      {/* Tree foliage - three circles */}
      <circle
        cx="22.5"
        cy="20"
        r="10"
        fill={COLORS.pencil.forestGreen}
        opacity="0.6"
      />
      <circle
        cx="17"
        cy="16"
        r="8"
        fill={COLORS.pencil.mossGreen}
        opacity="0.6"
      />
      <circle
        cx="28"
        cy="16"
        r="8"
        fill={COLORS.pencil.leafGreen}
        opacity="0.6"
      />
    </svg>
  );
}

export function StarDoodle({ style, size = 35 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 35 35"
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 17.5 5 L 20 13 L 28 13 L 22 18 L 24 26 L 17.5 21 L 11 26 L 13 18 L 7 13 L 15 13 Z"
        fill={COLORS.pencil.sunYellow}
        opacity="0.7"
        stroke={COLORS.ink.medium}
        strokeWidth="1"
      />
    </svg>
  );
}

export function FlowerDoodle({ style, size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stem */}
      <path
        d="M 20 40 Q 18 30, 20 20"
        stroke={COLORS.pencil.forestGreen}
        strokeWidth="2"
        fill="none"
      />
      {/* Petals */}
      <circle cx="20" cy="20" r="3" fill={COLORS.pencil.sunYellow} opacity="0.8" />
      <ellipse cx="20" cy="13" rx="3" ry="5" fill={COLORS.pencil.lavender} opacity="0.7" />
      <ellipse cx="27" cy="20" rx="5" ry="3" fill={COLORS.pencil.lavender} opacity="0.7" />
      <ellipse cx="20" cy="27" rx="3" ry="5" fill={COLORS.pencil.lavender} opacity="0.7" />
      <ellipse cx="13" cy="20" rx="5" ry="3" fill={COLORS.pencil.lavender} opacity="0.7" />
    </svg>
  );
}

export function ArrowDoodle({ style, size = 50, rotation = 0 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      style={{ ...style, transform: `rotate(${rotation}deg)` }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Arrow shaft */}
      <path
        d="M 10 25 L 35 25"
        stroke={COLORS.ink.medium}
        strokeWidth="2"
        fill="none"
      />
      {/* Arrow head */}
      <path
        d="M 30 18 L 40 25 L 30 32"
        stroke={COLORS.ink.medium}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

// Container component to scatter doodles around the page
export function PageDoodles({ density = 'low' }) {
  const doodleCount = density === 'low' ? 3 : density === 'medium' ? 5 : 8;

  const doodles = [
    { Component: LeafDoodle, positions: [{ top: '10%', right: '5%' }, { bottom: '20%', left: '3%' }] },
    { Component: BirdDoodle, positions: [{ top: '15%', left: '2%' }] },
    { Component: CompassDoodle, positions: [{ bottom: '10%', right: '3%' }] },
    { Component: MountainDoodle, positions: [{ top: '30%', right: '2%' }] },
    { Component: TreeDoodle, positions: [{ top: '50%', left: '1%' }] },
    { Component: FlowerDoodle, positions: [{ bottom: '30%', right: '4%' }] },
    { Component: StarDoodle, positions: [{ top: '5%', left: '5%' }] },
  ];

  const selectedDoodles = doodles.slice(0, doodleCount);

  return (
    <>
      {selectedDoodles.map(({ Component, positions }, idx) =>
        positions.map((pos, posIdx) => (
          <div
            key={`${idx}-${posIdx}`}
            style={{
              position: 'fixed',
              ...pos,
              opacity: 0.25,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <Component />
          </div>
        ))
      )}
    </>
  );
}
