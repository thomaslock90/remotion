import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/* ------------------------------------------------------------------ */
/*  sowly.ai brand palette                                             */
/* ------------------------------------------------------------------ */
const PAPER = '#FBFAF5';
const INK = '#0F2A1D';
const DEEP = '#2F6B45';
const SPROUT = '#74BD1F';
const WASH = '#C8E89A';
const CARD = '#FFFFFF';
const BORDER = 'rgba(15,42,29,0.12)';
const FAINT = 'rgba(15,42,29,0.45)';
// Semantic "leak" colour, only used for the weak-offer state
const STOP = '#C4532F';

const SANS =
  '"Helvetica Neue", Helvetica, "Liberation Sans", "DejaVu Sans", Arial, sans-serif';
const MONO =
  '"SF Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace';

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */
const STAGES = [
  {
    n: '01',
    title: 'Positionering',
    verb: 'Trekt aan',
    body: 'Je ICP snapt waarom je bestaat en waarom ze moeten luisteren.',
  },
  {
    n: '02',
    title: 'Offer',
    verb: 'Laat converteren',
    body: 'Zó logisch dat nee zeggen gek voelt. Neemt het risico weg.',
  },
  {
    n: '03',
    title: 'Levering & service',
    verb: 'Laat blijven',
    body: 'Maakt waar wat je belooft. Klanten bouwen mee aan je groei.',
  },
];

const BOOSTERS = [
  {title: 'Koppel het aan acute pijn', sub: 'urgentie in plaats van nice-to-have'},
  {title: 'Simpele pricing & scope', sub: 'de drempel om in te stappen verdwijnt'},
  {title: 'Harde resultaten', sub: 'bewijs neemt risico weg, geen marketingclaims'},
];

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */
const X = 80;
const COL_W = 280;
const COL_GAP = 40;
const colX = (i: number) => X + i * (COL_W + COL_GAP);
const colCenter = (i: number) => colX(i) + COL_W / 2;
const CARDS_TOP = 372;
const CARDS_H = 262;
const LANE_Y = 694;
const BOOST_TOP = 812;

/* Timeline (30 fps, 450 frames) */
const T_CARDS = 26;
const T_WEAK = 96;
const T_BOOST = 196;
const T_STRONG = 272;
const T_FOOTER = 380;
const LAST_SPAWN = 440;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ------------------------------------------------------------------ */

export const GtmOffer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logoIn = spring({frame: frame - 2, fps, config: {damping: 14, stiffness: 90, mass: 0.9}});
  const headIn = spring({frame: frame - 4, fps, config: {damping: 200}});
  const boostIn = spring({frame: frame - T_BOOST, fps, config: {damping: 200}});

  // 0 = weak offer (leads leak away), 1 = strong offer (leads convert)
  const strong = interpolate(frame, [T_STRONG - 10, T_STRONG + 10], [0, 1], clamp);
  const weakOn = interpolate(frame, [T_WEAK - 10, T_WEAK + 10], [0, 1], clamp) * (1 - strong);

  return (
    <AbsoluteFill style={{backgroundColor: PAPER, fontFamily: SANS, color: INK}}>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(120% 50% at 50% -6%, rgba(200,232,154,0.38), transparent 60%)',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: strong,
          background: 'radial-gradient(110% 50% at 50% 112%, rgba(116,189,31,0.16), transparent 60%)',
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

      {/* ---------- Logo ---------- */}
      <Img
        src={staticFile('sowly-logo.png')}
        style={{
          position: 'absolute',
          top: 86,
          right: X,
          height: 132,
          opacity: logoIn,
          transform: `scale(${0.85 + logoIn * 0.15})`,
          transformOrigin: 'top right',
        }}
      />

      {/* ---------- Header ---------- */}
      <div
        style={{
          position: 'absolute',
          top: 124,
          left: X,
          right: X,
          opacity: headIn,
          transform: `translateY(${(1 - headIn) * 16}px)`,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 19,
            letterSpacing: 5,
            color: DEEP,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 16,
          }}
        >
          <span style={{width: 32, height: 2, background: SPROUT}} />
          GEZONDE GTM · 3 STAPPEN
        </div>
        <div style={{fontSize: 56, fontWeight: 800, lineHeight: 1.06, letterSpacing: -1.5}}>
          Je verhaal trekt aan.
          <br />
          Je <span style={{background: WASH, padding: '0 12px', borderRadius: 10}}>offer</span>{' '}
          converteert.
        </div>
      </div>

      {/* ---------- "Here it goes wrong" tag ---------- */}
      <div
        style={{
          position: 'absolute',
          top: CARDS_TOP - 46,
          left: colX(1),
          width: COL_W,
          display: 'flex',
          justifyContent: 'center',
          opacity: interpolate(frame, [T_WEAK + 10, T_WEAK + 24], [0, 1], clamp),
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 1,
            color: STOP,
            background: '#F7E3DA',
            border: `1px solid ${STOP}55`,
            borderRadius: 999,
            padding: '6px 14px',
          }}
        >
          HIER GAAT HET VAAK MIS
        </div>
      </div>

      {/* ---------- Stage cards ---------- */}
      {STAGES.map((s, i) => {
        const cardIn = spring({frame: frame - T_CARDS - i * 14, fps, config: {damping: 200}});
        const isOffer = i === 1;
        const ring = isOffer
          ? interpolateColors(strong, [0, 1], [`rgba(196,83,47,${0.9 * weakOn})`, SPROUT])
          : 'transparent';
        return (
          <div
            key={s.n}
            style={{
              position: 'absolute',
              top: CARDS_TOP,
              left: colX(i),
              width: COL_W,
              height: CARDS_H,
              boxSizing: 'border-box',
              padding: '22px 22px',
              borderRadius: 20,
              background: isOffer ? INK : CARD,
              color: isOffer ? PAPER : INK,
              border: isOffer ? 'none' : `1px solid ${BORDER}`,
              boxShadow: isOffer
                ? `0 0 0 3px ${ring}, 0 20px 46px rgba(15,42,29,0.24)`
                : '0 10px 28px rgba(15,42,29,0.06)',
              opacity: cardIn,
              transform: `translateY(${(1 - cardIn) * 20}px)`,
            }}
          >
            <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 700, color: isOffer ? WASH : DEEP, opacity: 0.85}}>
              {s.n}
            </div>
            <div style={{fontSize: 30, fontWeight: 800, letterSpacing: -0.6, marginTop: 8, lineHeight: 1.08, minHeight: 66}}>
              {s.title}
            </div>
            <div
              style={{
                display: 'inline-block',
                marginTop: 8,
                padding: '5px 12px',
                borderRadius: 8,
                background: isOffer ? SPROUT : WASH,
                color: INK,
                fontSize: 18,
                fontWeight: 750,
              }}
            >
              {s.verb}
            </div>
            <div style={{fontSize: 18, lineHeight: 1.35, marginTop: 12, color: isOffer ? WASH : DEEP}}>{s.body}</div>
          </div>
        );
      })}

      {/* ---------- Flow lane ---------- */}
      <FlowLane frame={frame} strong={strong} />

      {/* Lane status */}
      <div
        style={{
          position: 'absolute',
          top: LANE_Y + 72,
          left: X,
          right: X,
          height: 26,
          fontFamily: MONO,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 0.5,
        }}
      >
        <div style={{position: 'absolute', inset: 0, textAlign: 'center', color: STOP, opacity: weakOn}}>
          Zwak offer → veel interesse, nauwelijks conversie
        </div>
        <div style={{position: 'absolute', inset: 0, textAlign: 'center', color: DEEP, opacity: strong}}>
          Sterk offer → interesse wordt klant, klant blijft
        </div>
      </div>

      {/* ---------- Boosters ---------- */}
      <div
        style={{
          position: 'absolute',
          top: BOOST_TOP,
          left: X,
          right: X,
          borderRadius: 22,
          background: CARD,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 14px 40px rgba(15,42,29,0.08)',
          padding: '24px 28px 14px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          opacity: boostIn,
          transform: `translateY(${(1 - boostIn) * 18}px)`,
        }}
      >
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: SPROUT}} />
        <div style={{fontSize: 30, fontWeight: 800, letterSpacing: -0.6, marginBottom: 8}}>
          Zo maak je je offer direct sterker
        </div>
        {BOOSTERS.map((b, i) => {
          const t = T_BOOST + 14 + i * 20;
          const rowIn = spring({frame: frame - t, fps, config: {damping: 200}});
          const tick = spring({frame: frame - t - 8, fps, config: {damping: 12, stiffness: 140}});
          return (
            <div
              key={b.title}
              style={{
                height: 100,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                borderTop: i === 0 ? 'none' : `1px solid ${BORDER}`,
                opacity: rowIn,
                transform: `translateX(${(1 - rowIn) * -18}px)`,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 13,
                  background: SPROUT,
                  color: INK,
                  fontSize: 24,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transform: `scale(${0.5 + tick * 0.5})`,
                }}
              >
                ✓
              </div>
              <div>
                <div style={{fontSize: 27, fontWeight: 750, letterSpacing: -0.4}}>{b.title}</div>
                <div style={{fontSize: 20, color: DEEP, marginTop: 3}}>{b.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- Footer ---------- */}
      <div
        style={{
          position: 'absolute',
          left: X,
          right: X,
          bottom: 64,
          fontSize: 24,
          fontWeight: 650,
          color: INK,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          opacity: interpolate(frame, [T_FOOTER, T_FOOTER + 20], [0, 1], clamp),
        }}
      >
        <span style={{width: 32, height: 2, background: SPROUT}} />
        Sluit je aanbod aan op je belofte, dan hoef je minder uit te leggen.
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/*  Leads travel left → right through the three stages. While the     */
/*  offer is weak most of them drop out at stage 02.                   */
/* ------------------------------------------------------------------ */
const FlowLane: React.FC<{frame: number; strong: number}> = ({frame, strong}) => {
  const laneIn = interpolate(frame, [T_WEAK - 20, T_WEAK], [0, 1], clamp);
  const x0 = X;
  const x1 = 1080 - X;
  const leakX = colCenter(1);
  const TRAVEL = 96;

  const dots: React.ReactNode[] = [];
  for (let t0 = T_WEAK, i = 0; t0 <= LAST_SPAWN; t0 += 7, i++) {
    const p = (frame - t0) / TRAVEL;
    if (p < 0 || p > 1) continue;
    const x = x0 + (x1 - x0) * p;
    // A lead leaks away if it reaches the offer while the offer is still weak
    const arriveAtOffer = t0 + ((leakX - x0) / (x1 - x0)) * TRAVEL;
    const leaks = arriveAtOffer < T_STRONG && i % 4 !== 0;
    let y = LANE_Y;
    let opacity = 1;
    let cx = x;
    if (leaks && x > leakX) {
      const d = frame - arriveAtOffer;
      cx = leakX + d * 0.6;
      y = LANE_Y + Math.min(d * d * 0.08, 58);
      opacity = interpolate(d, [0, 22, 34], [1, 0.9, 0], clamp);
    }
    if (opacity <= 0) continue;
    dots.push(
      <circle
        key={t0}
        cx={cx}
        cy={y}
        r={8}
        fill={leaks && x > leakX ? STOP : SPROUT}
        stroke={PAPER}
        strokeWidth={2}
        opacity={opacity}
      />,
    );
  }

  return (
    <svg width={1080} height={1350} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      <g opacity={laneIn}>
        <line x1={x0} y1={LANE_Y} x2={x1} y2={LANE_Y} stroke={BORDER} strokeWidth={4} strokeLinecap="round" />
        <line
          x1={leakX}
          y1={LANE_Y}
          x2={x1}
          y2={LANE_Y}
          stroke={SPROUT}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={strong}
        />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={colCenter(i)}
            cy={LANE_Y}
            r={11}
            fill={i === 1 ? INK : PAPER}
            stroke={i === 1 ? interpolateColors(strong, [0, 1], [STOP, SPROUT]) : DEEP}
            strokeWidth={3}
          />
        ))}
        <text x={x0} y={LANE_Y - 18} fontFamily={MONO} fontSize={15} fill={FAINT} letterSpacing={1.5}>
          LEADS
        </text>
        <text x={x1} y={LANE_Y - 18} fontFamily={MONO} fontSize={15} fill={FAINT} letterSpacing={1.5} textAnchor="end">
          KLANTEN
        </text>
      </g>
      {dots}
    </svg>
  );
};
