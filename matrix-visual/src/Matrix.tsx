import React from 'react';
import {AbsoluteFill, Img, interpolate, interpolateColors, staticFile, useCurrentFrame} from 'remotion';

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
const STOP = '#C4532F';
const STOP_WASH = '#F7E3DA';
const AMBER = '#C98A1B';

const SANS =
  '"Helvetica Neue", Helvetica, "Liberation Sans", "DejaVu Sans", Arial, sans-serif';
const MONO =
  '"SF Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace';

/* ------------------------------------------------------------------ */
/*  Layout (1080 x 1080)                                               */
/* ------------------------------------------------------------------ */
const X = 72;
const AXIS_X = 540;
const AXIS_Y = 582;
const COL = [{x: 92, w: 428}, {x: 560, w: 428}];
const ROW = [{y: 306, h: 256}, {y: 602, h: 256}];

type QKey = 'tl' | 'tr' | 'bl' | 'br';
type Quadrant = {
  key: QKey;
  col: 0 | 1;
  row: 0 | 1;
  icon: 'eye' | 'target' | 'pause' | 'warn';
  title: string;
  desc: string;
  tag: string;
  dot: string;
  hoverBg: string;
  hoverFg: string;
  hoverBorder: string;
};

const QUADRANTS: Quadrant[] = [
  {
    key: 'tl', col: 0, row: 0, icon: 'eye',
    title: 'Goede boodschap, weinig mensen zien het',
    desc: 'Het verhaal klopt, het systeem ontbreekt.',
    tag: 'Snel op te lossen', dot: AMBER,
    hoverBg: WASH, hoverFg: INK, hoverBorder: DEEP,
  },
  {
    key: 'tr', col: 1, row: 0, icon: 'target',
    title: 'Pipeline',
    desc: 'De juiste boodschap, elke week bij de juiste mensen.',
    tag: 'Allebei sterk', dot: SPROUT,
    hoverBg: INK, hoverFg: PAPER, hoverBorder: SPROUT,
  },
  {
    key: 'bl', col: 0, row: 1, icon: 'pause',
    title: 'Er gebeurt niets',
    desc: 'Geen richting en geen bereik.',
    tag: 'Goedkoopste fout', dot: '#5B8DB8',
    hoverBg: '#ECEAE2', hoverFg: INK, hoverBorder: FAINT,
  },
  {
    key: 'br', col: 1, row: 1, icon: 'warn',
    title: 'Verkeerde boodschap, snel naar je doelgroep',
    desc: 'Op schaal verbrand je je eigen markt.',
    tag: 'Duurste fout', dot: STOP,
    hoverBg: STOP_WASH, hoverFg: INK, hoverBorder: STOP,
  },
];

const center = (q: Quadrant) => ({x: COL[q.col].x + COL[q.col].w / 2, y: ROW[q.row].y + ROW[q.row].h / 2});
const byKey = (k: QKey) => QUADRANTS.find((q) => q.key === k)!;

/* ------------------------------------------------------------------ */
/*  Loop timeline (15 fps). Starts and ends on Pipeline so it loops.   */
/*  Then: nothing happens → the expensive mistake → the advice path:   */
/*  bottom-left, up first (strategy), then right (engineering).        */
/* ------------------------------------------------------------------ */
export const LOOP = 105;
const WAYPOINTS: {t: number; k: QKey}[] = [
  {t: 0, k: 'tr'},
  {t: 12, k: 'tr'},
  {t: 20, k: 'bl'},
  {t: 33, k: 'bl'},
  {t: 40, k: 'br'},
  {t: 54, k: 'br'},
  {t: 62, k: 'bl'},
  {t: 66, k: 'bl'},
  {t: 74, k: 'tl'},
  {t: 84, k: 'tl'},
  {t: 92, k: 'tr'},
  {t: LOOP, k: 'tr'},
];
const T_STEP1 = 74; // "1 · eerst omhoog" lands on top-left
const T_STEP2 = 92; // "2 · dan naar rechts" lands on top-right

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const cursorAt = (t: number) => {
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    const a = WAYPOINTS[i];
    const b = WAYPOINTS[i + 1];
    if (t >= a.t && t <= b.t) {
      const p = b.t === a.t ? 1 : ease((t - a.t) / (b.t - a.t));
      const ca = center(byKey(a.k));
      const cb = center(byKey(b.k));
      return {x: ca.x + (cb.x - ca.x) * p, y: ca.y + (cb.y - ca.y) * p, moving: a.k !== b.k};
    }
  }
  const c = center(byKey('tr'));
  return {...c, moving: false};
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ------------------------------------------------------------------ */

export const Matrix: React.FC = () => {
  const t = useCurrentFrame();
  const cur = cursorAt(t);
  const hover = (q: Quadrant) => {
    const c = center(q);
    const d = Math.hypot(cur.x - c.x, cur.y - c.y);
    return interpolate(d, [30, 200], [1, 0], clamp);
  };
  const anyHover = Math.max(...QUADRANTS.map(hover));
  // Step badges: on at the end (so also on frame 0), off while the tour runs
  const step1 = t < 12 ? 1 : interpolate(t, [12, 15, T_STEP1, T_STEP1 + 3], [1, 0, 0, 1], clamp);
  const step2 = t < 12 ? 1 : interpolate(t, [12, 15, T_STEP2, T_STEP2 + 3], [1, 0, 0, 1], clamp);
  // Click ripple whenever the cursor arrives at a waypoint
  const arrival = WAYPOINTS.filter((w, i) => i > 0 && WAYPOINTS[i - 1].k !== w.k).map((w) => w.t);
  const since = Math.min(...arrival.map((a) => (t >= a ? t - a : 999)));
  const ripple = since < 8 ? since / 8 : 1;

  return (
    <AbsoluteFill style={{backgroundColor: PAPER, fontFamily: SANS, color: INK}}>
      <AbsoluteFill
        style={{background: 'radial-gradient(120% 50% at 50% -6%, rgba(200,232,154,0.4), transparent 60%)'}}
      />

      {/* ---------- Header ---------- */}
      <Img src={staticFile('sowly-logo.png')} style={{position: 'absolute', top: 50, right: X, height: 96}} />
      <div style={{position: 'absolute', top: 62, left: X, right: 240}}>
        <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: 4, color: DEEP, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14}}>
          <span style={{width: 30, height: 2, background: SPROUT}} />
          STRATEGIE × ENGINEERING
        </div>
        <div style={{fontSize: 52, fontWeight: 800, lineHeight: 1.06, letterSpacing: -1.4}}>
          Eerst <span style={{background: WASH, padding: '0 10px', borderRadius: 10}}>omhoog</span>,
          <br />
          dan pas naar rechts.
        </div>
      </div>

      {/* ---------- Axes ---------- */}
      <svg width={1080} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <marker id="head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={DEEP} />
          </marker>
        </defs>
        <line x1={AXIS_X} y1={872} x2={AXIS_X} y2={300} stroke={DEEP} strokeWidth={3} markerEnd="url(#head)" />
        <line x1={84} y1={AXIS_Y} x2={1000} y2={AXIS_Y} stroke={DEEP} strokeWidth={3} markerEnd="url(#head)" />
      </svg>

      {/* ---------- Quadrants ---------- */}
      {QUADRANTS.map((q) => {
        const h = hover(q);
        const dim = 1 - 0.35 * Math.max(0, anyHover - h);
        const shake = q.key === 'br' && t > 42 && t < 54 ? Math.sin(t * 2.4) * 3 * h : 0;
        return (
          <div
            key={q.key}
            style={{
              position: 'absolute',
              left: COL[q.col].x,
              top: ROW[q.row].y,
              width: COL[q.col].w,
              height: ROW[q.row].h,
              boxSizing: 'border-box',
              padding: '24px 26px',
              borderRadius: 20,
              background: interpolateColors(h, [0, 1], [CARD, q.hoverBg]),
              color: interpolateColors(h, [0, 1], [INK, q.hoverFg]),
              border: `2px solid ${interpolateColors(h, [0, 1], ['rgba(15,42,29,0.10)', q.hoverBorder])}`,
              boxShadow: `0 ${8 + h * 18}px ${24 + h * 30}px rgba(15,42,29,${0.06 + h * 0.16})`,
              transform: `translate(${shake}px, ${-6 * h}px) scale(${1 + 0.035 * h})`,
              opacity: dim,
              display: 'flex',
              flexDirection: 'column',
              zIndex: h > 0.5 ? 2 : 1,
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <Icon kind={q.icon} active={h} dark={q.key === 'tr' && h > 0.5} />
              {q.key === 'tl' || q.key === 'tr' ? (
                <StepBadge n={q.key === 'tl' ? 1 : 2} label={q.key === 'tl' ? 'eerst omhoog' : 'dan naar rechts'} p={q.key === 'tl' ? step1 : step2} />
              ) : null}
            </div>
            <div style={{fontSize: 30, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.1, marginTop: 16}}>{q.title}</div>
            <div
              style={{
                fontSize: 19,
                lineHeight: 1.3,
                marginTop: 8,
                opacity: h,
                transform: `translateY(${(1 - h) * 8}px)`,
                color: q.key === 'tr' ? WASH : DEEP,
              }}
            >
              {q.desc}
            </div>
            <div style={{flex: 1}} />
            <div
              style={{
                alignSelf: 'flex-start',
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '7px 14px',
                borderRadius: 999,
                background: q.key === 'tr' && h > 0.5 ? 'rgba(200,232,154,0.14)' : CARD,
                border: `1px solid ${q.key === 'tr' && h > 0.5 ? 'rgba(200,232,154,0.4)' : BORDER}`,
                fontSize: 18,
                fontWeight: 700,
                color: q.key === 'br' ? STOP : q.key === 'tr' && h > 0.5 ? WASH : INK,
              }}
            >
              <span style={{width: 10, height: 10, borderRadius: 5, background: q.dot}} />
              {q.tag}
            </div>
          </div>
        );
      })}

      {/* ---------- Axis labels ---------- */}
      <AxisPill x={AXIS_X} y={300} text="STERKE STRATEGIE" />
      <AxisPill x={AXIS_X} y={872} text="ZWAKKE STRATEGIE" />
      <AxisPill x={190} y={AXIS_Y} text="ZWAKKE ENGINEERING" />
      <AxisPill x={890} y={AXIS_Y} text="STERKE ENGINEERING" />
      <div style={{position: 'absolute', left: AXIS_X - 9, top: AXIS_Y - 9, width: 18, height: 18, borderRadius: 9, background: PAPER, border: `3px solid ${DEEP}`, boxSizing: 'border-box', zIndex: 3}} />

      {/* ---------- Cursor ---------- */}
      {/* Cursor rests in the empty lower-right corner of each card, clear of the text */}
      <div style={{position: 'absolute', left: cur.x + 150, top: cur.y + 74, zIndex: 10}}>
        <div
          style={{
            position: 'absolute',
            left: -22,
            top: -22,
            width: 44,
            height: 44,
            borderRadius: 22,
            border: `3px solid ${SPROUT}`,
            opacity: 1 - ripple,
            transform: `scale(${0.4 + ripple * 1.4})`,
          }}
        />
        <svg width={40} height={46} viewBox="0 0 20 23" style={{position: 'absolute', left: -4, top: -3, filter: 'drop-shadow(0 4px 6px rgba(15,42,29,0.35))'}}>
          <path d="M2,1 L2,18 L6.5,14 L9.5,21 L12.5,19.7 L9.6,13 L16,13 Z" fill={CARD} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
      </div>

      {/* ---------- Footer ---------- */}
      <div style={{position: 'absolute', left: X, right: X, top: 918, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{fontSize: 26, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.2}}>
          Waar in deze matrix
          <br />
          zit <span style={{color: DEEP}}>jouw team</span> nu?
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <Img src={staticFile('thomas.jpg')} style={{width: 76, height: 76, borderRadius: 38, objectFit: 'cover', boxShadow: `0 0 0 3px ${SPROUT}`}} />
          <div>
            <div style={{fontSize: 22, fontWeight: 800}}>Thomas Lock</div>
            <div style={{fontSize: 17, color: DEEP, fontWeight: 600, marginTop: 2}}>GTM & RevOps architect · Sowly.ai</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */

const AxisPill: React.FC<{x: number; y: number; text: string}> = ({x, y, text}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: 'translate(-50%, -50%)',
      padding: '8px 16px',
      borderRadius: 999,
      background: DEEP,
      color: PAPER,
      fontFamily: MONO,
      fontSize: 15,
      fontWeight: 800,
      letterSpacing: 2,
      whiteSpace: 'nowrap',
      zIndex: 3,
    }}
  >
    {text}
  </div>
);

const StepBadge: React.FC<{n: number; label: string; p: number}> = ({n, label, p}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 12px 6px 6px',
      borderRadius: 999,
      background: SPROUT,
      color: INK,
      fontSize: 16,
      fontWeight: 800,
      opacity: p,
      transform: `scale(${0.6 + 0.4 * p})`,
      transformOrigin: 'right center',
    }}
  >
    <span style={{width: 24, height: 24, borderRadius: 12, background: INK, color: SPROUT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 14}}>
      {n}
    </span>
    {label}
  </div>
);

const Icon: React.FC<{kind: 'eye' | 'target' | 'pause' | 'warn'; active: number; dark: boolean}> = ({kind, active, dark}) => {
  const stroke = kind === 'warn' ? STOP : dark ? SPROUT : DEEP;
  return (
    <div
      style={{
        width: 54,
        height: 54,
        borderRadius: 27,
        background: dark ? 'rgba(200,232,154,0.14)' : interpolateColors(active, [0, 1], ['rgba(200,232,154,0.45)', CARD]),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        {kind === 'eye' ? (
          <>
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
            <circle cx={12} cy={12} r={3} />
          </>
        ) : null}
        {kind === 'target' ? (
          <>
            <circle cx={12} cy={12} r={9} />
            <circle cx={12} cy={12} r={5} />
            <circle cx={12} cy={12} r={1.5} fill={stroke} />
          </>
        ) : null}
        {kind === 'pause' ? (
          <>
            <circle cx={12} cy={12} r={9} />
            <path d="M10 9v6M14 9v6" />
          </>
        ) : null}
        {kind === 'warn' ? (
          <>
            <path d="M12 3 2 20h20L12 3Z" />
            <path d="M12 10v4M12 17h.01" />
          </>
        ) : null}
      </svg>
    </div>
  );
};
