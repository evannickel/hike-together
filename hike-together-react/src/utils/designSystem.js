import { COLORS, SHADOWS, RADIUS, SPACING } from './constants';

// 📖 Paper Texture Pattern - Simulates aged sketchbook paper
export const paperTexture = `
  repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    ${COLORS.paper.shadow}10 2px,
    ${COLORS.paper.shadow}10 3px
  ),
  repeating-linear-gradient(
    90deg,
    transparent,
    transparent 2px,
    ${COLORS.paper.shadow}08 2px,
    ${COLORS.paper.shadow}08 3px
  ),
  radial-gradient(
    circle at 30% 40%,
    ${COLORS.paper.aged}20 0%,
    transparent 60%
  ),
  radial-gradient(
    circle at 70% 80%,
    ${COLORS.paper.shadow}15 0%,
    transparent 50%
  )
`;

// ✏️ Sketchy Border Generator
export const sketchyBorder = {
  light: `
    box-shadow:
      0 0 0 1px ${COLORS.ink.light}40,
      1px 1px 0 1px ${COLORS.ink.light}30,
      2px 1px 0 1px ${COLORS.ink.light}20,
      1px 2px 0 1px ${COLORS.ink.light}20
  `,
  medium: `
    box-shadow:
      0 0 0 2px ${COLORS.ink.medium}60,
      1px 2px 0 2px ${COLORS.ink.medium}40,
      2px 2px 0 2px ${COLORS.ink.medium}30,
      1px 3px 0 2px ${COLORS.ink.medium}20
  `,
  dark: `
    box-shadow:
      0 0 0 2px ${COLORS.ink.black}80,
      1px 2px 0 2px ${COLORS.ink.dark}60,
      2px 3px 0 2px ${COLORS.ink.dark}40
  `,
};

// 🎨 Colored Pencil Gradients
export const gradients = {
  forest: `linear-gradient(135deg, ${COLORS.pencil.forestGreen} 0%, ${COLORS.pencil.mossGreen} 100%)`,
  sky: `linear-gradient(135deg, ${COLORS.pencil.skyBlue} 0%, ${COLORS.pencil.seaBlue} 100%)`,
  earth: `linear-gradient(135deg, ${COLORS.pencil.earthBrown} 0%, ${COLORS.pencil.clayOrange} 100%)`,
  sun: `linear-gradient(135deg, ${COLORS.pencil.sunYellow} 0%, ${COLORS.pencil.clayOrange} 100%)`,
  berry: `linear-gradient(135deg, ${COLORS.pencil.berryRed} 0%, ${COLORS.pencil.lavender} 100%)`,
};

// 🏔️ Common Styles - Field Journal Aesthetic
export const commonStyles = {
  // Page container with paper texture
  pageContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: SPACING.lg,
    minHeight: '100vh',
    background: COLORS.paper.cream,
    backgroundImage: paperTexture,
    backgroundSize: '100% 100%',
    fontFamily: "'Open Sans', sans-serif",
  },

  // Card styles like journal pages
  card: {
    background: COLORS.paper.offWhite,
    borderRadius: '3px', // Slightly irregular, less rounded
    padding: SPACING.lg,
    border: `2px solid ${COLORS.ink.light}40`,
    boxShadow: `
      2px 2px 0 ${COLORS.ink.light}20,
      4px 4px 8px ${COLORS.paper.shadow}30
    `,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    position: 'relative',
  },

  cardHover: {
    transform: 'translateY(-2px) rotate(0.5deg)', // Slight rotation for hand-drawn feel
    boxShadow: `
      3px 3px 0 ${COLORS.ink.light}30,
      6px 6px 12px ${COLORS.paper.shadow}40
    `,
  },

  // Button styles - hand-drawn
  button: {
    padding: `${SPACING.md} ${SPACING.lg}`,
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: '16px',
    fontFamily: "'Open Sans', sans-serif",
    cursor: 'pointer',
    border: `2px solid ${COLORS.ink.black}`,
    transition: 'all 0.2s ease',
    position: 'relative',
  },

  buttonPrimary: {
    background: COLORS.pencil.forestGreen,
    color: COLORS.paper.offWhite,
    border: `2px solid ${COLORS.ink.dark}`,
    boxShadow: `
      2px 2px 0 ${COLORS.ink.dark}40,
      0 0 0 3px ${COLORS.pencil.forestGreen}30
    `,
  },

  buttonPrimaryHover: {
    transform: 'translateY(-1px)',
    boxShadow: `
      3px 3px 0 ${COLORS.ink.dark}50,
      0 0 0 4px ${COLORS.pencil.forestGreen}40
    `,
  },

  // Header styles with handwritten font
  heading: {
    fontFamily: "'Caveat', cursive",
    fontWeight: '600',
    color: COLORS.ink.black,
    margin: 0,
    letterSpacing: '0.5px',
  },

  headingLarge: {
    fontSize: '42px',
    color: COLORS.ink.black,
    fontWeight: '700',
    textShadow: `2px 2px 0 ${COLORS.paper.shadow}`,
  },

  headingMedium: {
    fontSize: '32px',
    color: COLORS.pencil.forestGreen,
    fontWeight: '600',
  },

  headingSmall: {
    fontSize: '24px',
    color: COLORS.ink.dark,
    fontWeight: '500',
  },

  // 🎨 Badge card styled as sticker/patch with stitched edges
  badgeCard: {
    background: COLORS.paper.offWhite,
    borderRadius: '8px',
    padding: SPACING.md,
    textAlign: 'center',
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: `3px dashed ${COLORS.ink.light}60`, // Stitched edge effect
    boxShadow: `
      2px 2px 4px ${COLORS.paper.shadow}40,
      inset 0 0 20px ${COLORS.paper.aged}30
    `,
  },

  badgeCardEarned: {
    background: COLORS.paper.offWhite,
    border: `3px dashed ${COLORS.pencil.forestGreen}80`, // Stitched in colored pencil
    boxShadow: `
      3px 3px 6px ${COLORS.paper.shadow}60,
      inset 0 0 30px ${COLORS.wash.green},
      0 0 0 1px ${COLORS.pencil.forestGreen}30
    `,
  },

  badgeCardHover: {
    transform: 'translateY(-4px) rotate(-1deg)', // Slight rotation for playful feel
    boxShadow: `
      4px 4px 8px ${COLORS.paper.shadow}70,
      inset 0 0 30px ${COLORS.paper.aged}40
    `,
  },

  // Progress bar like pencil marks
  trailProgress: {
    height: '10px',
    background: COLORS.paper.aged,
    borderRadius: '2px',
    overflow: 'hidden',
    position: 'relative',
    border: `1px solid ${COLORS.ink.light}40`,
    boxShadow: `inset 0 1px 2px ${COLORS.paper.shadow}40`,
  },

  trailProgressFill: {
    height: '100%',
    background: gradients.forest,
    borderRadius: '2px',
    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    boxShadow: `inset 0 1px 0 ${COLORS.pencil.mossGreen}40`,
  },

  // Tab navigation - handwritten tabs
  tab: {
    padding: `${SPACING.md} ${SPACING.lg}`,
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: COLORS.ink.medium,
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    marginBottom: '-3px',
    transition: 'all 0.2s ease',
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: '500',
  },

  tabActive: {
    color: COLORS.pencil.forestGreen,
    borderBottom: `3px solid ${COLORS.pencil.forestGreen}`,
    fontWeight: '600',
    fontFamily: "'Caveat', cursive",
    fontSize: '18px',
  },
};

// ✨ Animation Keyframes (for inline styles)
export const animations = {
  // Bounce animation for celebrations
  bounce: {
    animation: 'bounce 0.6s ease-in-out infinite',
  },

  // Fade in
  fadeIn: {
    animation: 'fadeIn 0.5s ease-out',
  },

  // Slide up
  slideUp: {
    animation: 'slideUp 0.4s ease-out',
  },
};

// Create CSS animation keyframes (these would go in a global style or index.css)
export const globalAnimations = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 5px currentColor; }
    50% { box-shadow: 0 0 20px currentColor; }
  }
`;

// 🎯 Utility functions for getting badge category styles
export const getBadgeCategoryStyle = (category) => {
  if (!category || !category.gradient) return {};

  return {
    background: `linear-gradient(135deg, ${category.gradient[0]} 0%, ${category.gradient[1]} 100%)`,
    color: 'white',
  };
};

// 🌟 Get difficulty color
export const getDifficultyStyle = (difficulty) => {
  const colors = {
    easy: COLORS.nature.leaf,
    moderate: COLORS.sunset.yellow,
    hard: COLORS.nature.berry,
  };

  return {
    color: colors[difficulty] || COLORS.textLight,
    fontWeight: '600',
  };
};
