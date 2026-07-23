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
/*  sowly.ai brand palette                                             */
/*  Ink / Sprout / Deep / Paper / Wash                                 */
/* ------------------------------------------------------------------ */
const PAPER = '#FBFAF5';
const INK = '#0F2A1D';
const DEEP = '#2F6B45';
const SPROUT = '#74BD1F';
const WASH = '#C8E89A';
const CARD = '#FFFFFF';
const BORDER = 'rgba(15,42,29,0.12)';
const FAINT = 'rgba(15,42,29,0.42)';

// Growth ramp: seed-pale Wash → Sprout → Deep. Encodes "cold data grows warm".
const RAMP = ['#C8E89A', '#A6D95E', '#8ECF33', '#74BD1F', '#4E9A3C', '#2F6B45'];

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
const PIPE_TOP = 400;
const ROW_H = 137;
const BADGE = 58;
const RAIL_X = 92 + BADGE / 2;

const badgeCenterY = (i: number) => PIPE_TOP + i * ROW_H + BADGE / 2;
const badgeText = (i: number) => (i >= 4 ? PAPER : INK);

/* Reveal timing */
const START = 26;
const PER = 42;
const revealAt = (i: number) => START + i * PER;
const BUILD_END = revealAt(STEPS.length - 1) + PER;

/* ------------------------------------------------------------------ */
/*  Sprout mark (recreated as SVG, on-palette)                        */
/* ------------------------------------------------------------------ */
const Sprout: React.FC<{size: number; color: string; grow?: number}> = ({
  size,
  color,
  grow = 1,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 120" style={{display: 'block'}}>
    <g style={{transformOrigin: '50px 112px', transform: `scale(${grow})`}}>
      {/* seed leaf at base */}
      <path d="M50,112 C43,104 38,95 44,88 C55,92 58,103 50,112 Z" fill={color} />
      {/* stem */}
      <path
        d="M50,110 C49,92 49,76 50,60"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
      {/* left cotyledon */}
      <path d="M50,64 C40,42 26,33 15,27 C24,46 37,56 50,64 Z" fill={color} />
      {/* right cotyledon */}
      <path d="M50,60 C61,36 76,26 87,21 C76,41 63,52 50,60 Z" fill={color} />
    </g>
  </svg>
);

const LogoLockup: React.FC<{scale?: number; grow?: number}> = ({scale = 1, grow = 1}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12 * scale}}>
    <Sprout size={46 * scale} color={INK} grow={grow} />
    <div
      style={{
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 32 * scale,
        letterSpacing: -0.6,
        color: INK,
      }}
    >
      Sowly<span style={{color: DEEP}}>.ai</span>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */

export const GtmFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const grow = interpolate(frame, [START, BUILD_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const headIn = spring({frame: frame - 4, fps, config: {damping: 200}});
  const logoGrow = spring({frame: frame - 2, fps, config: {damping: 12, stiffness: 90, mass: 0.9}});

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

  return (
    <AbsoluteFill style={{backgroundColor: PAPER, fontFamily: SANS}}>
      {/* Ambient wash glows — a soft green base that grows as the pipeline fills */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 55% at 50% -6%, rgba(200,232,154,0.35), transparent 60%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: grow,
          background: `radial-gradient(110% 55% at 50% 112%, rgba(116,189,31,0.18), transparent 60%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.6,
          backgroundImage:
            'linear-gradient(rgba(15,42,29,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,42,29,0.035) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          maskImage: 'radial-gradient(120% 90% at 50% 42%, #000 55%, transparent 100%)',
        }}
      />

      {/* ---------- Header ---------- */}
      <div
        style={{
          position: 'absolute',
          top: 88,
          left: 92,
          right: 92,
          opacity: headIn,
          transform: `translateY(${(1 - headIn) * 16}px)`,
        }}
      >
        <div style={{marginBottom: 26}}>
          <LogoLockup grow={logoGrow} />
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 20,
            letterSpacing: 5.5,
            color: DEEP,
            display: 'flex',
            alignItems: 'center',
            gap: 15,
            marginBottom: 18,
          }}
        >
          <span style={{width: 32, height: 2, background: SPROUT}} />
          SIGNAL-BASED OUTBOUND
        </div>
        <div
          style={{
            fontSize: 55,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -1.4,
            color: INK,
          }}
        >
          From a cold list to a task
          <br />
          your rep can act on{' '}
          <span
            style={{
              background: WASH,
              color: INK,
              padding: '0 12px',
              borderRadius: 10,
              boxDecorationBreak: 'clone',
              WebkitBoxDecorationBreak: 'clone',
            }}
          >
            today
          </span>
          .
        </div>
      </div>

      {/* ---------- Connectors ---------- */}
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

      {/* ---------- Travelling seed / packet ---------- */}
      <div
        style={{
          position: 'absolute',
          left: RAIL_X,
          top: packetY,
          width: 20,
          height: 20,
          marginLeft: -10,
          marginTop: -10,
          borderRadius: '50%',
          background: packetColor,
          opacity: packetOpacity,
          boxShadow: `0 0 18px 5px ${WASH}`,
        }}
      />

      {/* ---------- Footer ---------- */}
      <div
        style={{
          position: 'absolute',
          left: 92,
          right: 92,
          bottom: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: interpolate(frame, [10, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 19,
            letterSpacing: 1.5,
            color: FAINT,
          }}
        >
          <span style={{color: DEEP, fontWeight: 700}}>COLD DATA</span>
          <span> {'──▶'} </span>
          <span style={{color: DEEP, fontWeight: 700}}>READY TO ACT</span>
        </div>
        <GrowthBar frame={frame} />
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

  const isLast = i === STEPS.length - 1;
  const pulse = isLast ? Math.sin(Math.max(0, frame - (BUILD_END + 6)) / 5) * 0.5 + 0.5 : 0;
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
          borderRadius: 15,
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 21,
          color: badgeText(i),
          opacity: appear,
          transform: `scale(${0.4 + badgePop * 0.6})`,
          boxShadow: `0 8px 20px ${color}44`,
          outline: pulseGlow ? `${2 + pulse * 6}px solid ${SPROUT}` : 'none',
          outlineOffset: `${pulse * 4}px`,
        }}
      >
        {step.n}
      </div>

      {/* Card */}
      <div
        style={{
          position: 'absolute',
          left: 184,
          top: centerY - 52,
          right: 92,
          minHeight: 104,
          padding: '15px 24px',
          borderRadius: 18,
          background: CARD,
          border: `1px solid ${isLast ? DEEP + '88' : BORDER}`,
          boxShadow: isLast
            ? `0 0 0 1px ${SPROUT}55, 0 16px 40px rgba(47,107,69,0.20)`
            : '0 8px 26px rgba(15,42,29,0.05)',
          opacity: cardIn,
          transform: `translateX(${(1 - cardIn) * -22}px)`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            background: color,
          }}
        />
        <div style={{fontSize: 32, fontWeight: 750, letterSpacing: -0.6, color: INK}}>
          {step.title}
        </div>
        <div style={{fontSize: 21, color: DEEP, marginTop: 2}}>{step.what}</div>
        <div style={{fontFamily: MONO, fontSize: 17, color: DEEP, marginTop: 9, opacity: 0.85}}>
          {'▸ '}
          {step.example}
        </div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Growth legend bar                                                  */
/* ------------------------------------------------------------------ */
const GrowthBar: React.FC<{frame: number}> = ({frame}) => {
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
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
        }}
      />
    </div>
  );
};
