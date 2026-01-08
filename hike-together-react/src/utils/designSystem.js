import { COLORS, SHADOWS, RADIUS, SPACING } from './constants';

// 🗺️ Topographic Pattern Background
export const topographicPattern = `
  repeating-linear-gradient(
    0deg,
    transparent,
    transparent 50px,
    ${COLORS.forest.main}08 50px,
    ${COLORS.forest.main}08 51px
  ),
  repeating-linear-gradient(
    90deg,
    transparent,
    transparent 50px,
    ${COLORS.forest.main}06 50px,
    ${COLORS.forest.main}06 51px
  ),
  radial-gradient(
    circle at 20% 80%,
    ${COLORS.forest.pale}15 0%,
    transparent 50%
  ),
  radial-gradient(
    circle at 80% 20%,
    ${COLORS.sky.pale}20 0%,
    transparent 50%
  )
`;

// 🎨 Gradient Backgrounds
export const gradients = {
  forest: `linear-gradient(135deg, ${COLORS.forest.main} 0%, ${COLORS.forest.medium} 100%)`,
  sky: `linear-gradient(135deg, ${COLORS.sky.main} 0%, ${COLORS.sky.light} 100%)`,
  sunset: `linear-gradient(135deg, ${COLORS.sunset.orange} 0%, ${COLORS.sunset.pink} 100%)`,
  earth: `linear-gradient(135deg, ${COLORS.earth.medium} 0%, ${COLORS.earth.light} 100%)`,
  nature: `linear-gradient(135deg, ${COLORS.nature.leaf} 0%, ${COLORS.nature.water} 100%)`,
};

// 🏔️ Common Styles
export const commonStyles = {
  // Page container with topographic background
  pageContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: SPACING.lg,
    minHeight: '100vh',
    background: COLORS.background,
    backgroundImage: topographicPattern,
    backgroundSize: '100px 100px, 100px 100px, 100% 100%, 100% 100%',
    fontFamily: "'Poppins', sans-serif",
  },

  // Card styles with nature theme
  card: {
    background: 'white',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    boxShadow: SHADOWS.card,
    border: `1px solid ${COLORS.border}`,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },

  cardHover: {
    transform: 'translateY(-2px)',
    boxShadow: SHADOWS.md,
  },

  // Button styles
  button: {
    padding: `${SPACING.md} ${SPACING.lg}`,
    borderRadius: RADIUS.md,
    fontWeight: '600',
    fontSize: '16px',
    fontFamily: "'Poppins', sans-serif",
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s ease',
  },

  buttonPrimary: {
    background: gradients.forest,
    color: 'white',
    boxShadow: SHADOWS.sm,
  },

  buttonPrimaryHover: {
    transform: 'translateY(-1px)',
    boxShadow: SHADOWS.md,
  },

  // Header styles with playful font
  heading: {
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: '600',
    color: COLORS.text,
    margin: 0,
  },

  headingLarge: {
    fontSize: '32px',
    background: gradients.forest,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  headingMedium: {
    fontSize: '24px',
    color: COLORS.forest.main,
  },

  headingSmall: {
    fontSize: '18px',
    color: COLORS.text,
  },

  // Badge card with illustrated style
  badgeCard: {
    background: 'white',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: `2px solid ${COLORS.border}`,
  },

  badgeCardEarned: {
    background: `linear-gradient(135deg, white 0%, ${COLORS.forest.pale}30 100%)`,
    border: `2px solid ${COLORS.forest.medium}`,
    boxShadow: SHADOWS.badge,
  },

  badgeCardHover: {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: SHADOWS.lg,
  },

  // Progress bar like a trail
  trailProgress: {
    height: '12px',
    background: `linear-gradient(90deg, ${COLORS.earth.light}30 0%, ${COLORS.earth.light}30 100%)`,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    position: 'relative',
    border: `1px solid ${COLORS.earth.light}60`,
  },

  trailProgressFill: {
    height: '100%',
    background: gradients.forest,
    borderRadius: RADIUS.full,
    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    boxShadow: `0 0 10px ${COLORS.forest.main}60`,
  },

  // Tab navigation
  tab: {
    padding: `${SPACING.md} ${SPACING.lg}`,
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: COLORS.textLight,
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    marginBottom: '-3px',
    transition: 'all 0.2s ease',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: '500',
  },

  tabActive: {
    color: COLORS.forest.main,
    borderBottom: `3px solid ${COLORS.forest.main}`,
    fontWeight: '600',
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
