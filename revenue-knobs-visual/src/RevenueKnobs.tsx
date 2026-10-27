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
const STOP = '#C4532F';
const STOP_WASH = '#F7E3DA';

const SANS =
  '"Helvetica Neue", Helvetica, "Liberation Sans", "DejaVu Sans", Arial, sans-serif';
const MONO =
  '"SF Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace';

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */
const KNOBS = [
  {team: 'MARKETING', title: 'Focus op 3 sectoren', kpi: 'KPI: MQL → SQL in die sectoren'},
  {team: 'SALES', title: 'Outbound alleen op die 3', kpi: 'KPI: demo → deal'},
  {team: 'CUSTOMER SUCCESS', title: 'Uitbreidingssignalen', kpi: 'KPI: upsell → extra omzet'},
];

const RULES = [
  {when: 'ONDER DE KPI', what: 'Stoppen', bg: STOP_WASH, fg: STOP, border: `${STOP}55`},
  {when: 'TOT 10% ERBOVEN', what: 'Bijsturen', bg: CARD, fg: INK, border: BORDER},
  {when: '10% OF MEER ERBOVEN', what: 'Opschalen', bg: SPROUT, fg: INK, border: SPROUT},
];

const BEFORE = 3.0;
const AFTER = 1.7;

/* ------------------------------------------------------------------ */
/*  Layout (1080 x 1080)                                               */
/* ------------------------------------------------------------------ */
const X = 72;
const W = 1080 - 2 * X;
const CARD_TOP = 246;
const CARD_H = 520;
const RULES_TOP = CARD_TOP + CARD_H + 40;

/* Timeline (30 fps, 450 frames) */
const T_CARD = 22;
const T_KNOBS = 50;
const T_TURN = 140;
const TURN_EVERY = 55;
const TURN_LEN = 36;
const T_RULES = 330;
const T_FOOTER = 380;
const FINAL = 449;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const nl1 = (n: number) => n.toFixed(1).replace('.', ',');

/* ------------------------------------------------------------------ */

export const RevenueKnobs: React.FC = () => <Scene loop={false} />;

// Seamless loop for the GIF: starts and ends on the finished visual; the knobs drop back
// to "no choices" (3,0x demos) and turn up again to 1,7x.
export const RevenueKnobsLoop: React.FC = () => <Scene loop />;

const Scene: React.FC<{loop: boolean}> = ({loop}) => {
  const raw = useCurrentFrame();
  const {durationInFrames, fps: videoFps} = useVideoConfig();
  const frame = loop ? FINAL : raw;
  const fps = loop ? 30 : videoFps;
  const t = raw / durationInFrames;

  const turns = KNOBS.map((_, i) => {
    if (loop) {
      const u = Math.min(1, Math.max(0, (t - i * 0.05) / 0.85));
      return 1 - Math.sin(Math.PI * u) ** 2;
    }
    const start = T_TURN + i * TURN_EVERY;
    return interpolate(frame, [start, start + TURN_LEN], [0, 1], {
      ...clamp,
      easing: (x) => 1 - Math.pow(1 - x, 3),
    });
  });
  const progress = turns.reduce((a, b) => a + b, 0) / turns.length;
  const demos = BEFORE - (BEFORE - AFTER) * progress;

  const logoIn = spring({frame: frame - 2, fps, config: {damping: 14, stiffness: 90, mass: 0.9}});
  const headIn = spring({frame: frame - 4, fps, config: {damping: 200}});
  const cardIn = spring({frame: frame - T_CARD, fps, config: {damping: 200}});

  return (
    <AbsoluteFill style={{backgroundColor: PAPER, fontFamily: SANS, color: INK}}>
      <AbsoluteFill
        style={{background: 'radial-gradient(120% 50% at 50% -6%, rgba(200,232,154,0.38), transparent 60%)'}}
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
          top: 50,
          right: X,
          height: 100,
          opacity: logoIn,
          transform: `scale(${0.85 + logoIn * 0.15})`,
          transformOrigin: 'top right',
        }}
      />

      {/* ---------- Header ---------- */}
      <div
        style={{
          position: 'absolute',
          top: 64,
          left: X,
          right: 260,
          opacity: headIn,
          transform: `translateY(${(1 - headIn) * 16}px)`,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 18,
            letterSpacing: 4,
            color: DEEP,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 14,
          }}
        >
          <span style={{width: 30, height: 2, background: SPROUT}} />
          GTM ENGINEERING
        </div>
        <div style={{fontSize: 50, fontWeight: 800, lineHeight: 1.07, letterSpacing: -1.3}}>
          Automations halen geen omzetdoel.{' '}
          <span style={{background: WASH, padding: '0 10px', borderRadius: 10}}>Teams</span> doen dat.
        </div>
      </div>

      {/* ---------- Revenue model card ---------- */}
      <div
        style={{
          position: 'absolute',
          top: CARD_TOP,
          left: X,
          width: W,
          height: CARD_H,
          boxSizing: 'border-box',
          padding: '20px 22px 22px',
          borderRadius: 24,
          background: CARD,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 14px 40px rgba(15,42,29,0.08)',
          opacity: cardIn,
          transform: `translateY(${(1 - cardIn) * 18}px)`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 2.5, color: INK}}>
            REKENMODEL · OMZETDOEL
          </div>
          <div style={{display: 'flex', gap: 6, alignItems: 'center', fontFamily: MONO, fontSize: 14, color: DEEP}}>
            {['1 Feiten', '2 Hypothese', '3 Meten'].map((s, i) => (
              <React.Fragment key={s}>
                {i > 0 ? <span style={{color: SPROUT}}>→</span> : null}
                <span style={{padding: '4px 8px', borderRadius: 6, background: 'rgba(200,232,154,0.45)'}}>{s}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{display: 'flex', gap: 20, marginTop: 18, flex: 1}}>
          {/* Knobs */}
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 12}}>
            {KNOBS.map((k, i) => {
              const inn = spring({frame: frame - T_KNOBS - i * 12, fps, config: {damping: 200}});
              return (
                <div
                  key={k.team}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    padding: '0 16px',
                    borderRadius: 16,
                    background: PAPER,
                    border: `1px solid ${BORDER}`,
                    opacity: inn,
                    transform: `translateX(${(1 - inn) * -16}px)`,
                  }}
                >
                  <Dial turn={turns[i]} />
                  <div>
                    <div style={{fontFamily: MONO, fontSize: 14, fontWeight: 800, letterSpacing: 2, color: DEEP}}>{k.team}</div>
                    <div style={{fontSize: 23, fontWeight: 800, letterSpacing: -0.3, marginTop: 4}}>{k.title}</div>
                    <div style={{fontSize: 16, color: DEEP, marginTop: 3}}>{k.kpi}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Output */}
          <div
            style={{
              width: 330,
              boxSizing: 'border-box',
              padding: '22px 22px',
              borderRadius: 18,
              background: INK,
              color: PAPER,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{fontFamily: MONO, fontSize: 14, letterSpacing: 1.5, color: WASH, lineHeight: 1.4}}>
              DEMO’S NODIG VOOR
              <br />
              HETZELFDE OMZETDOEL
            </div>
            <div style={{fontSize: 104, fontWeight: 800, letterSpacing: -3, color: SPROUT, lineHeight: 1, marginTop: 14}}>
              {nl1(demos)}×
            </div>
            <div style={{flex: 1}} />
            {[
              {label: 'Zonder keuzes', v: BEFORE, c: 'rgba(251,250,245,0.28)', fixed: true},
              {label: 'Met keuzes', v: demos, c: SPROUT, fixed: false},
            ].map((b) => (
              <div key={b.label} style={{marginTop: 12}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700}}>
                  <span style={{color: b.fixed ? 'rgba(251,250,245,0.7)' : PAPER}}>{b.label}</span>
                  <span style={{color: b.fixed ? 'rgba(251,250,245,0.7)' : SPROUT}}>{nl1(b.v)}×</span>
                </div>
                <div style={{height: 12, borderRadius: 6, background: 'rgba(251,250,245,0.08)', marginTop: 6}}>
                  <div style={{width: `${(b.v / BEFORE) * 100}%`, height: '100%', borderRadius: 6, background: b.c}} />
                </div>
              </div>
            ))}
            <div style={{fontSize: 16, color: WASH, marginTop: 14, lineHeight: 1.35}}>
              Hetzelfde doel, zonder dat sales zich kapot rent.
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Test rules ---------- */}
      <div
        style={{
          position: 'absolute',
          top: RULES_TOP,
          left: X,
          right: X,
          opacity: interpolate(frame, [T_RULES, T_RULES + 15], [0, 1], clamp),
        }}
      >
        <div style={{fontFamily: MONO, fontSize: 15, letterSpacing: 2, color: DEEP, marginBottom: 12}}>
          3 MAANDEN TESTEN · KPI PER TEAM · DAARNA PER KPI:
        </div>
        <div style={{display: 'flex', gap: 14}}>
          {RULES.map((r, i) => {
            const pop = spring({frame: frame - T_RULES - 8 - i * 10, fps, config: {damping: 14, stiffness: 140}});
            return (
              <div
                key={r.what}
                style={{
                  flex: 1,
                  padding: '20px 20px',
                  borderRadius: 14,
                  background: r.bg,
                  border: `1px solid ${r.border}`,
                  opacity: pop,
                  transform: `scale(${0.9 + pop * 0.1})`,
                }}
              >
                <div style={{fontFamily: MONO, fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: r.fg, opacity: 0.8}}>
                  {r.when}
                </div>
                <div style={{fontSize: 26, fontWeight: 800, color: r.fg, marginTop: 4}}>→ {r.what}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------- Footer question ---------- */}
      <div
        style={{
          position: 'absolute',
          left: X,
          right: X,
          bottom: 46,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontSize: 22,
          fontWeight: 700,
          opacity: interpolate(frame, [T_FOOTER, T_FOOTER + 20], [0, 1], clamp),
        }}
      >
        <span style={{width: 30, height: 2, background: SPROUT, flexShrink: 0}} />
        Kijken jouw sales, marketing en CS al naar hetzelfde dashboard?
      </div>
    </AbsoluteFill>
  );
};

/* A rotary knob: track arc, filled value arc, pointer */
const Dial: React.FC<{turn: number}> = ({turn}) => {
  const size = 76;
  const r = 28;
  const c = size / 2;
  const a0 = -225; // start angle (deg, svg coords)
  const sweep = 270;
  const reach = 0.85; // final position is not maxed out
  const a = a0 + sweep * reach * turn;
  const pt = (deg: number, rad: number) => {
    const rr = (deg * Math.PI) / 180;
    return [c + rad * Math.cos(rr), c + rad * Math.sin(rr)];
  };
  const arc = (from: number, to: number) => {
    const [x0, y0] = pt(from, r);
    const [x1, y1] = pt(to, r);
    const large = to - from > 180 ? 1 : 0;
    return `M${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1}`;
  };
  const [px, py] = pt(a, r - 12);
  return (
    <svg width={size} height={size} style={{flexShrink: 0}}>
      <path d={arc(a0, a0 + sweep)} stroke="rgba(15,42,29,0.12)" strokeWidth={7} fill="none" strokeLinecap="round" />
      {turn > 0.005 ? <path d={arc(a0, a)} stroke={SPROUT} strokeWidth={7} fill="none" strokeLinecap="round" /> : null}
      <circle cx={c} cy={c} r={17} fill={INK} />
      <line x1={c} y1={c} x2={px} y2={py} stroke={WASH} strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
};
