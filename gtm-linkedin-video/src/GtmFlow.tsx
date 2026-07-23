import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/* ------------------------------------------------------------------ */
/*  Palette — cool ink ground, a curated cold→hot heat ramp           */
/* ------------------------------------------------------------------ */
const INK = '#0A0E16';
const TEXT = '#EAEEF6';
const SOFT = '#9BA7B9';
const FAINT = '#5E6982';
const CARD = 'rgba(255,255,255,0.028)';
const CARD_BORDER = 'rgba(255,255,255,0.09)';

const RAMP = ['#8588F1', '#5C9FE7', '#33BCAC', '#E4B547', '#EC8B54', '#3EC082'];

const SANS =
  '"Helvetica Neue", Helvetica, "Liberation Sans", "DejaVu Sans", Arial, sans-serif';
const MONO =
  '"SF Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace';

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */
type Step = {n: string; title: string; what: string; example: string};

const STEPS: Step[] = [
  {n: '01', title: 'Prospect list', what: 'Define the ICP universe', example: '4,200 accounts match'},
  {n: '02', title: 'Signal sourcing', what: 'Catch the buying trigger', example: 'Series B · 6 days ago'},
  {n: '03', title: 'Qualification', what: 'Score fit × timing', example: 'Fit 87 · Priority A'},
  {n: '04', title: 'Contact lookup', what: 'Find & verify the buyer', example: 'VP Sales · email 98%'},
  {n: '05', title: 'Context for rep', what: 'Brief the why-now', example: 'Lead with ramp-time'},
  {n: '06', title: 'CRM task', what: 'Assigned & ready to run', example: 'Call today · notes attached'},
];

/* ------------------------------------------------------------------ */
/*  Layout constants (used for precise packet travel)                 */
/* ------------------------------------------------------------------ */
const PIPE_TOP = 372;
const ROW_H = 143;
const BADGE = 60;
const RAIL_X = 92 + BADGE / 2; // center of the badge column

const badgeCenterY = (i: number) => PIPE_TOP + i * ROW_H + BADGE / 2;

/* Reveal timing */
const START = 26;
const PER = 42;
const revealAt = (i: number) => START + i * PER;
const BUILD_END = revealAt(STEPS.length - 1) + PER; // ~296

/* ------------------------------------------------------------------ */

export const GtmFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // Overall warm-up progress 0..1 for the ambient glow
  const warm = interpolate(frame, [START, BUILD_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Header entrance
  const headIn = spring({frame: frame - 4, fps, config: {damping: 200}});

  // Packet position along the rail
  const buildProg = interpolate(frame, [START, revealAt(STEPS.length - 1)], [0, STEPS.length - 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const segFloor = Math.min(Math.floor(buildProg), STEPS.length - 1);
  const segNext = Math.min(segFloor + 1, STEPS.length - 1);
  const segFrac = buildProg - segFloor;
  const packetY =
    badgeCenterY(segFloor) + (badgeCenterY(segNext) - badgeCenterY(segFloor)) * segFrac;
  const packetColor = interpolateColors(buildProg, [0, 1, 2, 3, 4, 5], RAMP);
  const packetOpacity = interpolate(
    frame,
    [START - 6, START + 4, BUILD_END - 20, BUILD_END + 6],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  // Final tagline emphasis
  const tagIn = spring({frame: frame - (BUILD_END + 4), fps, config: {damping: 200}});

  return (
    <AbsoluteFill style={{backgroundColor: INK, fontFamily: SANS}}>
      {/* Ambient glows — cool at top, a warm base that grows as the pipeline fills */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 60% at 50% -8%, rgba(93,159,231,0.16), transparent 60%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: warm,
          background: `radial-gradient(110% 55% at 50% 112%, rgba(62,192,130,0.20), transparent 62%)`,
        }}
      />
      {/* faint grid texture */}
      <AbsoluteFill
        style={{
          opacity: 0.5,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          maskImage: 'radial-gradient(120% 90% at 50% 40%, #000 55%, transparent 100%)',
        }}
      />

      {/* ---------- Header ---------- */}
      <div
        style={{
          position: 'absolute',
          top: 96,
          left: 92,
          right: 92,
          opacity: headIn,
          transform: `translateY(${(1 - headIn) * 18}px)`,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 21,
            letterSpacing: 6,
            color: SOFT,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 22,
          }}
        >
          <span style={{width: 34, height: 2, background: 'rgba(255,255,255,0.28)'}} />
          SIGNAL-BASED OUTBOUND
        </div>
        <div
          style={{
            fontSize: 58,
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: -1.4,
            color: TEXT,
          }}
        >
          From a cold list to a task
          <br />
          your rep can act on <span style={{color: RAMP[4]}}>today</span>.
        </div>
      </div>

      {/* ---------- Connectors (drawn behind badges) ---------- */}
      {STEPS.slice(0, -1).map((_, i) => {
        const top = badgeCenterY(i) + BADGE / 2 - 2;
        const h = badgeCenterY(i + 1) - BADGE / 2 - (badgeCenterY(i) + BADGE / 2) + 4;
        const draw = interpolate(frame, [revealAt(i) + 8, revealAt(i) + 30], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={`c${i}`}
            style={{
              position: 'absolute',
              left: RAIL_X - 1.5,
              top,
              width: 3,
              height: h,
              borderRadius: 3,
              transformOrigin: 'top',
              transform: `scaleY(${draw})`,
              background: `linear-gradient(180deg, ${RAMP[i]}, ${RAMP[i + 1]})`,
            }}
          />
        );
      })}

      {/* ---------- Steps ---------- */}
      {STEPS.map((step, i) => (
        <StepRow key={step.n} step={step} i={i} frame={frame} fps={fps} />
      ))}

      {/* ---------- Travelling data packet ---------- */}
      <div
        style={{
          position: 'absolute',
          left: RAIL_X,
          top: packetY,
          width: 22,
          height: 22,
          marginLeft: -11,
          marginTop: -11,
          borderRadius: '50%',
          background: packetColor,
          opacity: packetOpacity,
          boxShadow: `0 0 22px 6px ${packetColor}`,
        }}
      />

      {/* ---------- Footer tagline ---------- */}
      <div
        style={{
          position: 'absolute',
          left: 92,
          right: 92,
          bottom: 74,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: interpolate(frame, [10, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 20,
            letterSpacing: 2,
            color: FAINT,
            transform: `scale(${0.98 + tagIn * 0.02})`,
            transformOrigin: 'left center',
          }}
        >
          <span style={{color: RAMP[0]}}>COLD DATA</span>
          <span style={{color: FAINT}}> {'──▶'} </span>
          <span style={{color: RAMP[5], opacity: 0.5 + tagIn * 0.5}}>READY TO ACT</span>
        </div>
        <HeatBar frame={frame} />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/*  A single pipeline step                                             */
/* ------------------------------------------------------------------ */
const StepRow: React.FC<{step: Step; i: number; frame: number; fps: number}> = ({
  step,
  i,
  frame,
  fps,
}) => {
  const color = RAMP[i];
  const t0 = revealAt(i);

  const badgePop = spring({frame: frame - t0, fps, config: {damping: 12, stiffness: 130, mass: 0.7}});
  const cardIn = spring({frame: frame - t0 - 3, fps, config: {damping: 200}});
  const appear = interpolate(frame, [t0, t0 + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const badgeTop = PIPE_TOP + i * ROW_H;
  const centerY = badgeCenterY(i);

  // The final "activation" pulse on the CRM task (last step)
  const isLast = i === STEPS.length - 1;
  const pulse = isLast
    ? Math.sin(Math.max(0, frame - (BUILD_END + 6)) / 5) * 0.5 + 0.5
    : 0;
  const pulseGlow = isLast
    ? interpolate(frame, [BUILD_END, BUILD_END + 12], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <>
      {/* Badge */}
      <div
        style={{
          position: 'absolute',
          left: 92,
          top: badgeTop,
          width: BADGE,
          height: BADGE,
          borderRadius: 16,
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 22,
          color: '#0A0E16',
          opacity: appear,
          transform: `scale(${0.4 + badgePop * 0.6})`,
          boxShadow: `0 10px 26px ${color}55${pulseGlow ? '' : ''}`,
          outline: pulseGlow ? `${2 + pulse * 6}px solid ${color}` : 'none',
          outlineOffset: `${pulse * 4}px`,
        }}
      >
        {step.n}
      </div>

      {/* Card */}
      <div
        style={{
          position: 'absolute',
          left: 186,
          top: centerY - 56,
          right: 92,
          minHeight: 112,
          padding: '16px 24px',
          borderRadius: 18,
          background: CARD,
          border: `1px solid ${isLast ? color + 'cc' : CARD_BORDER}`,
          boxShadow: isLast
            ? `0 0 0 1px ${color}44, 0 18px 44px ${color}22`
            : 'none',
          opacity: cardIn,
          transform: `translateX(${(1 - cardIn) * -22}px)`,
          overflow: 'hidden',
        }}
      >
        {/* left accent rail */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            background: color,
            opacity: 0.9,
          }}
        />
        <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
          <div style={{fontSize: 33, fontWeight: 750, letterSpacing: -0.6, color: TEXT}}>
            {step.title}
          </div>
        </div>
        <div style={{fontSize: 22, color: SOFT, marginTop: 3}}>{step.what}</div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 17.5,
            color,
            marginTop: 10,
            opacity: 0.92,
          }}
        >
          {'▸ '}
          {step.example}
        </div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Little animated heat legend bar in the footer                     */
/* ------------------------------------------------------------------ */
const HeatBar: React.FC<{frame: number}> = ({frame}) => {
  const sheen = interpolate(frame % 100, [0, 55, 100], [-1.1, 2.4, 2.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'relative',
        width: 150,
        height: 8,
        borderRadius: 6,
        overflow: 'hidden',
        background: `linear-gradient(90deg, ${RAMP.join(',')})`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${sheen * 100}%)`,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
        }}
      />
    </div>
  );
};
