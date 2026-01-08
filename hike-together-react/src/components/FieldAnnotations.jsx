import { COLORS } from '../utils/constants';

// ✏️ Field Note Annotations - Handwritten style arrows, circles, and notes

export function AnnotationArrow({ text, position = 'right', style }) {
  const arrowStyles = {
    right: {
      arrow: 'M 0 10 L 40 10 L 35 5 M 40 10 L 35 15',
      textX: 45,
      textY: 15,
      anchor: 'start',
    },
    left: {
      arrow: 'M 50 10 L 10 10 L 15 5 M 10 10 L 15 15',
      textX: 5,
      textY: 15,
      anchor: 'end',
    },
    down: {
      arrow: 'M 25 0 L 25 40 L 20 35 M 25 40 L 30 35',
      textX: 25,
      textY: 50,
      anchor: 'middle',
    },
    up: {
      arrow: 'M 25 50 L 25 10 L 20 15 M 25 10 L 30 15',
      textX: 25,
      textY: 5,
      anchor: 'middle',
    },
  };

  const currentStyle = arrowStyles[position] || arrowStyles.right;

  return (
    <div style={{ display: 'inline-block', ...style }}>
      <svg width="100" height="60" xmlns="http://www.w3.org/2000/svg">
        <path
          d={currentStyle.arrow}
          stroke={COLORS.ink.medium}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <text
          x={currentStyle.textX}
          y={currentStyle.textY}
          fontFamily="'Kalam', cursive"
          fontSize="12"
          fill={COLORS.ink.medium}
          textAnchor={currentStyle.anchor}
        >
          {text}
        </text>
      </svg>
    </div>
  );
}

export function AnnotationCircle({ style, size = 60 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sketchy circle - hand-drawn appearance */}
      <ellipse
        cx="30"
        cy="30"
        rx="24"
        ry="26"
        fill="none"
        stroke={COLORS.pencil.berryRed}
        strokeWidth="2"
        opacity="0.6"
        strokeDasharray="2,1"
      />
    </svg>
  );
}

export function AnnotationUnderline({ text, style }) {
  const textWidth = text.length * 8;

  return (
    <div style={{ display: 'inline-block', position: 'relative', ...style }}>
      <span
        style={{
          fontFamily: "'Kalam', cursive",
          fontSize: '14px',
          color: COLORS.ink.dark,
        }}
      >
        {text}
      </span>
      <svg
        width={textWidth}
        height="4"
        style={{
          position: 'absolute',
          bottom: '-2px',
          left: '0',
        }}
      >
        <path
          d={`M 0 2 Q ${textWidth / 4} 1, ${textWidth / 2} 2 T ${textWidth} 2`}
          stroke={COLORS.pencil.berryRed}
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  );
}

export function HandwrittenNote({ text, style }) {
  return (
    <div
      style={{
        fontFamily: "'Kalam', cursive",
        fontSize: '13px',
        color: COLORS.ink.medium,
        padding: '8px 12px',
        background: COLORS.wash.yellow,
        border: `1px dashed ${COLORS.pencil.sunYellow}`,
        borderRadius: '3px',
        maxWidth: '200px',
        lineHeight: '1.4',
        ...style,
      }}
    >
      {text}
    </div>
  );
}

// Floating annotation that can be positioned anywhere
export function FloatingAnnotation({ text, arrow = 'right', style }) {
  return (
    <div style={{ position: 'absolute', ...style }}>
      <HandwrittenNote text={text} />
      {arrow && (
        <div style={{ position: 'absolute', top: '50%', left: arrow === 'left' ? '-50px' : '100%' }}>
          <AnnotationArrow position={arrow} text="" style={{ marginTop: '-10px' }} />
        </div>
      )}
    </div>
  );
}
