import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
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
const REST = 'rgba(15,42,29,0.10)';
// Semantic "mismatch" colour, only used for the one-message warning
const STOP = '#C4532F';
const STOP_WASH = '#F7E3DA';

const SANS =
  '"Helvetica Neue", Helvetica, "Liberation Sans", "DejaVu Sans", Arial, sans-serif';
const MONO =
  '"SF Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace';

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */
const MID_PCT = 55;
const ENT_PCT = 18;
const REST_PCT = 100 - MID_PCT - ENT_PCT;

const ROWS = [
  {
    label: 'DECISION MAKERS',
    mid: {title: 'Founder of manager', sub: 'je praat direct met de beslisser'},
    ent: {title: 'Procurement, security & C-level', sub: 'meerdere poortwachters'},
  },
  {
    label: 'BUYER JOURNEY',
    mid: {title: '1 persoon · ±2 weken', sub: 'hakt zelf de knoop door'},
    ent: {title: '±10 stakeholders · maanden', sub: 'approval flows'},
  },
  {
    label: 'BELANGEN',
    mid: {title: 'Snel resultaat', sub: 'en minder gedoe'},
    ent: {title: 'Risicospreiding', sub: 'compliance & naadloze integratie'},
  },
];

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */
const X = 80;
const W = 1080 - 2 * X; // 920
const DATA_TOP = 336;
const BAR_W = W - 56;
const COL_W = 440;
const COL_GAP = W - 2 * COL_W; // 40
const COLS_TOP = 598;
const ROW_H = 142;
const COLS_H = 96 + ROWS.length * ROW_H;
const WARN_TOP = COLS_TOP + COLS_H + 34;

/* Timeline (30 fps, 450 frames) */
const T_DATA = 24;
const T_BAR = 44;
const T_COLS = 120;
const T_ROWS = 150;
const T_WARN = 300;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ------------------------------------------------------------------ */

export const SegmentSplit: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logoIn = spring({frame: frame - 2, fps, config: {damping: 14, stiffness: 90, mass: 0.9}});
  const headIn = spring({frame: frame - 4, fps, config: {damping: 200}});
  const dataIn = spring({frame: frame - T_DATA, fps, config: {damping: 200}});
  const bar = interpolate(frame, [T_BAR, T_BAR + 50], [0, 1], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const labelsIn = interpolate(frame, [T_BAR + 40, T_BAR + 60], [0, 1], clamp);
  const warnIn = spring({frame: frame - T_WARN, fps, config: {damping: 200}});

  const midW = (BAR_W * MID_PCT) / 100;
  const restW = (BAR_W * REST_PCT) / 100;
  const entW = (BAR_W * ENT_PCT) / 100;

  return (
    <AbsoluteFill style={{backgroundColor: PAPER, fontFamily: SANS, color: INK}}>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(120% 50% at 50% -6%, rgba(200,232,154,0.38), transparent 60%)',
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
          “WE TARGETEN FASHION”
        </div>
        <div style={{fontSize: 52, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5}}>
          Eén vertical.
          <br />
          <span style={{background: WASH, padding: '0 12px', borderRadius: 10}}>Twee</span> totaal
          andere werelden.
        </div>
      </div>

      {/* ---------- Customer analysis ---------- */}
      <div
        style={{
          position: 'absolute',
          top: DATA_TOP,
          left: X,
          width: W,
          boxSizing: 'border-box',
          padding: '22px 28px 20px',
          borderRadius: 20,
          background: CARD,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 10px 28px rgba(15,42,29,0.06)',
          opacity: dataIn,
          transform: `translateY(${(1 - dataIn) * 16}px)`,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
          <div style={{fontSize: 24, fontWeight: 750, letterSpacing: -0.3}}>Klantanalyse Fashion & Lifestyle</div>
          <div style={{fontFamily: MONO, fontSize: 16, color: FAINT, letterSpacing: 1.5}}>HONDERDEN ACCOUNTS</div>
        </div>

        <div
          style={{
            position: 'relative',
            marginTop: 18,
            width: BAR_W,
            height: 54,
            borderRadius: 12,
            overflow: 'hidden',
            background: REST,
          }}
        >
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: midW * bar, background: SPROUT}} />
          <div
            style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: entW * bar, background: INK}}
          />
          <BarLabel left={0} width={midW} color={INK} opacity={labelsIn} text={`${Math.round(MID_PCT * bar)}%`} />
          <BarLabel left={midW} width={restW} color={FAINT} opacity={labelsIn} text={`${REST_PCT}%`} small />
          <BarLabel left={midW + restW} width={entW} color={PAPER} opacity={labelsIn} text={`${Math.round(ENT_PCT * bar)}%`} />
        </div>

        <div
          style={{
            position: 'relative',
            height: 52,
            marginTop: 12,
            opacity: labelsIn,
          }}
        >
          <div style={{position: 'absolute', left: 0, top: 0}}>
            <div style={{fontSize: 21, fontWeight: 750}}>Mid-market</div>
            <div style={{fontFamily: MONO, fontSize: 16, color: DEEP, marginTop: 2}}>€1M – €25M omzet</div>
          </div>
          <div style={{position: 'absolute', left: midW, width: restW, top: 0, textAlign: 'center'}}>
            <div style={{fontFamily: MONO, fontSize: 16, color: FAINT, marginTop: 6}}>overig</div>
          </div>
          <div style={{position: 'absolute', right: 0, top: 0, textAlign: 'right'}}>
            <div style={{fontSize: 21, fontWeight: 750}}>Enterprise</div>
            <div style={{fontFamily: MONO, fontSize: 16, color: DEEP, marginTop: 2}}>€200M+ omzet</div>
          </div>
        </div>
      </div>

      {/* ---------- Split connectors ---------- */}
      <SplitConnectors frame={frame} midCenter={X + 28 + midW / 2} entCenter={X + 28 + BAR_W - entW / 2} />

      {/* ---------- Two worlds ---------- */}
      <World
        frame={frame}
        fps={fps}
        left={X}
        dark={false}
        name="Mid-market"
        pct={MID_PCT}
        side="mid"
      />
      <World
        frame={frame}
        fps={fps}
        left={X + COL_W + COL_GAP}
        dark
        name="Enterprise"
        pct={ENT_PCT}
        side="ent"
      />

      {/* ---------- One message for both? ---------- */}
      <div
        style={{
          position: 'absolute',
          top: WARN_TOP,
          left: X,
          width: W,
          opacity: warnIn,
          transform: `translateY(${(1 - warnIn) * 14}px)`,
        }}
      >
        <div style={{fontSize: 25, fontWeight: 800, letterSpacing: -0.4, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14}}>
          <span style={{width: 32, height: 2, background: STOP}} />
          Eén bericht voor beide werelden?
        </div>
        <div style={{display: 'flex', gap: COL_GAP}}>
          {['Te zwaar en te traag', 'Veel te licht'].map((t, i) => {
            const pop = spring({frame: frame - T_WARN - 14 - i * 10, fps, config: {damping: 12, stiffness: 140}});
            return (
              <div
                key={t}
                style={{
                  width: COL_W,
                  boxSizing: 'border-box',
                  padding: '13px 18px',
                  borderRadius: 12,
                  background: STOP_WASH,
                  border: `1px solid ${STOP}55`,
                  color: STOP,
                  fontSize: 21,
                  fontWeight: 750,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transform: `scale(${0.85 + pop * 0.15})`,
                  opacity: pop,
                }}
              >
                ✕ {t}
                <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 15, fontWeight: 700, opacity: 0.8}}>
                  {i === 0 ? 'MID-MARKET' : 'ENTERPRISE'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */

const BarLabel: React.FC<{
  left: number;
  width: number;
  color: string;
  opacity: number;
  text: string;
  small?: boolean;
}> = ({left, width, color, opacity, text, small}) => (
  <div
    style={{
      position: 'absolute',
      left,
      width,
      top: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: MONO,
      fontWeight: 800,
      fontSize: small ? 18 : 26,
      color,
      opacity,
    }}
  >
    {text}
  </div>
);

/* Lines from each bar segment down into its own world */
const SplitConnectors: React.FC<{frame: number; midCenter: number; entCenter: number}> = ({
  frame,
  midCenter,
  entCenter,
}) => {
  const draw = interpolate(frame, [T_COLS - 24, T_COLS + 4], [0, 1], clamp);
  const y0 = DATA_TOP + 206;
  const y1 = COLS_TOP;
  const midTarget = X + COL_W / 2;
  const entTarget = X + COL_W + COL_GAP + COL_W / 2;
  const len = 200;
  return (
    <svg width={1080} height={1350} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      {[
        {from: midCenter, to: midTarget, color: SPROUT},
        {from: entCenter, to: entTarget, color: INK},
      ].map((c) => (
        <path
          key={c.color}
          d={`M${c.from},${y0} C${c.from},${(y0 + y1) / 2} ${c.to},${(y0 + y1) / 2} ${c.to},${y1}`}
          stroke={c.color}
          strokeWidth={3}
          fill="none"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - draw)}
          opacity={0.7}
        />
      ))}
    </svg>
  );
};

const World: React.FC<{
  frame: number;
  fps: number;
  left: number;
  dark: boolean;
  name: string;
  pct: number;
  side: 'mid' | 'ent';
}> = ({frame, fps, left, dark, name, pct, side}) => {
  const delay = side === 'mid' ? 0 : 8;
  const cardIn = spring({frame: frame - T_COLS - delay, fps, config: {damping: 200}});
  const fg = dark ? PAPER : INK;
  const sub = dark ? WASH : DEEP;
  const line = dark ? 'rgba(200,232,154,0.18)' : BORDER;
  return (
    <div
      style={{
        position: 'absolute',
        top: COLS_TOP,
        left,
        width: COL_W,
        height: COLS_H,
        boxSizing: 'border-box',
        padding: '24px 26px 0',
        borderRadius: 22,
        background: dark ? INK : CARD,
        border: dark ? 'none' : `1px solid ${BORDER}`,
        boxShadow: dark ? '0 20px 46px rgba(15,42,29,0.24)' : '0 10px 28px rgba(15,42,29,0.06)',
        color: fg,
        opacity: cardIn,
        transform: `translateY(${(1 - cardIn) * 20}px)`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 48}}>
        <div style={{fontSize: 32, fontWeight: 800, letterSpacing: -0.6}}>{name}</div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 18,
            fontWeight: 800,
            padding: '6px 12px',
            borderRadius: 8,
            background: dark ? 'rgba(200,232,154,0.16)' : WASH,
            color: dark ? WASH : INK,
          }}
        >
          {pct}%
        </div>
      </div>
      <div style={{height: 24}} />
      {ROWS.map((r, i) => {
        const rowIn = spring({frame: frame - T_ROWS - i * 40 - delay, fps, config: {damping: 200}});
        const v = r[side];
        return (
          <div
            key={r.label}
            style={{
              height: ROW_H,
              boxSizing: 'border-box',
              borderTop: `1px solid ${line}`,
              paddingTop: 18,
              opacity: rowIn,
              transform: `translateX(${(1 - rowIn) * (side === 'mid' ? -16 : 16)}px)`,
            }}
          >
            <div style={{fontFamily: MONO, fontSize: 15, letterSpacing: 2, color: sub, opacity: 0.75}}>
              {r.label}
            </div>
            <div style={{fontSize: 26, fontWeight: 750, letterSpacing: -0.4, marginTop: 8, lineHeight: 1.15}}>
              {v.title}
            </div>
            <div style={{fontSize: 19, color: sub, marginTop: 5}}>{v.sub}</div>
          </div>
        );
      })}
    </div>
  );
};
