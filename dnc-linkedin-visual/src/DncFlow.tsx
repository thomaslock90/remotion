import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
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
// Semantic "blocked" colour, only used for the excluded branch
const STOP = '#C4532F';
const STOP_WASH = '#F7E3DA';

const SANS =
  '"Helvetica Neue", Helvetica, "Liberation Sans", "DejaVu Sans", Arial, sans-serif';
const MONO =
  '"SF Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace';

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */
const TOTAL = 1240;
const EXCLUDED = 186;

const DNC_ITEMS = [
  'Bestaande klanten',
  'Leveranciers & partners',
  'Open deals & CRM-contacten',
  'Blocklist (opt-out)',
];

const HITL_STEPS = [
  {title: 'Verrijken in Clay', sub: 'valideren tegen ICP'},
  {title: 'LinkedIn-connectie checken', sub: 'lead ⇄ rep'},
  {title: 'Gepersonaliseerde draft', sub: 'klaargezet per lead'},
  {title: 'Notificatie in Slack', sub: '#outbound-review'},
  {title: 'Human check', sub: 'goedkeuren → verzenden'},
];

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */
const X = 80;
const W = 1080 - 2 * X;
const LIST_TOP = 352;
const LIST_H = 64;
const DNC_TOP = 456;
const DNC_H = 262;
const SPLIT_TOP = DNC_TOP + DNC_H; // 718
const HITL_TOP = 826;
const HITL_ROW = 64;
const FOOTER_BOTTOM = 58;

/* Timeline */
const T_LIST = 22;
const T_DNC = 48;
const T_FLOW = 110;
const T_FLOW_END = 200;
const T_HITL = 170;
const T_APPROVE = 292;
const T_FOOTER = 300;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const nl = (n: number) => Math.round(n).toLocaleString('nl-NL');

/* ------------------------------------------------------------------ */
/*  Sprout logo                                                        */
/* ------------------------------------------------------------------ */
const Sprout: React.FC<{size: number; color: string; grow: number}> = ({size, color, grow}) => (
  <svg width={size} height={size} viewBox="0 0 100 120" style={{display: 'block'}}>
    <g style={{transformOrigin: '50px 112px', transform: `scale(${grow})`}}>
      <path d="M50,112 C43,104 38,95 44,88 C55,92 58,103 50,112 Z" fill={color} />
      <path
        d="M50,110 C49,92 49,76 50,60"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
      <path d="M50,64 C40,42 26,33 15,27 C24,46 37,56 50,64 Z" fill={color} />
      <path d="M50,60 C61,36 76,26 87,21 C76,41 63,52 50,60 Z" fill={color} />
    </g>
  </svg>
);

const Shield: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block'}}>
    <path
      d="M12 2.5 4 5.5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10v-6l-8-3Z"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <path d="M8.5 12.2 11 14.6l4.6-5" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ------------------------------------------------------------------ */

export const DncFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const headIn = spring({frame: frame - 4, fps, config: {damping: 200}});
  const logoGrow = spring({frame: frame - 2, fps, config: {damping: 12, stiffness: 90, mass: 0.9}});
  const listIn = spring({frame: frame - T_LIST, fps, config: {damping: 200}});
  const dncIn = spring({frame: frame - T_DNC, fps, config: {damping: 200}});
  const hitlIn = spring({frame: frame - T_HITL, fps, config: {damping: 200}});

  const leadCount = interpolate(frame, [T_LIST, T_LIST + 30], [0, TOTAL], clamp);
  const flowProg = interpolate(frame, [T_FLOW, T_FLOW_END], [0, 1], clamp);
  const excludedCount = EXCLUDED * flowProg;
  const passedCount = (TOTAL - EXCLUDED) * flowProg;
  const splitIn = interpolate(frame, [T_FLOW - 10, T_FLOW + 10], [0, 1], clamp);

  const approve = spring({frame: frame - T_APPROVE, fps, config: {damping: 14, stiffness: 120}});

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

      {/* ---------- Header ---------- */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: X,
          right: X,
          opacity: headIn,
          transform: `translateY(${(1 - headIn) * 16}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24}}>
          <Sprout size={44} color={INK} grow={logoGrow} />
          <div style={{fontWeight: 800, fontSize: 30, letterSpacing: -0.6}}>
            Sowly<span style={{color: DEEP}}>.ai</span>
          </div>
        </div>
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
          OUTBOUND · NUL RISICO VOOR RELATIES
        </div>
        <div style={{fontSize: 56, fontWeight: 800, lineHeight: 1.06, letterSpacing: -1.5}}>
          Eerst de{' '}
          <span style={{background: WASH, padding: '0 12px', borderRadius: 10}}>DNC list</span>.
          <br />
          Dán pas één bericht eruit.
        </div>
      </div>

      {/* ---------- Lead list ---------- */}
      <div
        style={{
          position: 'absolute',
          top: LIST_TOP,
          left: X,
          width: W,
          height: LIST_H,
          borderRadius: 16,
          background: CARD,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 8px 24px rgba(15,42,29,0.05)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 16,
          opacity: listIn,
          transform: `translateY(${(1 - listIn) * 14}px)`,
        }}
      >
        <div style={{fontFamily: MONO, fontSize: 17, color: FAINT, letterSpacing: 2}}>INPUT</div>
        <div style={{fontSize: 27, fontWeight: 750, letterSpacing: -0.4}}>Nieuwe leadlijst</div>
        <div style={{flex: 1, display: 'flex', gap: 7, justifyContent: 'flex-end', paddingRight: 8}}>
          {new Array(16).fill(0).map((_, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                background: WASH,
                opacity: interpolate(frame, [T_LIST + i * 1.5, T_LIST + 8 + i * 1.5], [0, 1], clamp),
              }}
            />
          ))}
        </div>
        <div style={{fontFamily: MONO, fontSize: 21, fontWeight: 700, color: DEEP, minWidth: 150, textAlign: 'right'}}>
          {nl(leadCount)} leads
        </div>
      </div>

      {/* Connector list → DNC */}
      <div
        style={{
          position: 'absolute',
          left: 540 - 1.5,
          top: LIST_TOP + LIST_H,
          width: 3,
          height: DNC_TOP - LIST_TOP - LIST_H,
          background: DEEP,
          opacity: 0.5,
          transformOrigin: 'top',
          transform: `scaleY(${interpolate(frame, [T_DNC - 8, T_DNC + 6], [0, 1], clamp)})`,
        }}
      />

      {/* ---------- DNC filter ---------- */}
      <div
        style={{
          position: 'absolute',
          top: DNC_TOP,
          left: X,
          width: W,
          height: DNC_H,
          borderRadius: 22,
          background: INK,
          padding: '26px 30px',
          boxSizing: 'border-box',
          boxShadow: '0 22px 50px rgba(15,42,29,0.22)',
          opacity: dncIn,
          transform: `translateY(${(1 - dncIn) * 18}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <Shield size={34} color={SPROUT} />
          <div style={{fontSize: 32, fontWeight: 800, color: PAPER, letterSpacing: -0.6}}>
            DNC list
          </div>
          <div style={{fontSize: 22, color: WASH, opacity: 0.8}}>Do-Not-Contact · altijd uitsluiten</div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginTop: 20,
          }}
        >
          {DNC_ITEMS.map((item, i) => {
            const chipIn = spring({frame: frame - T_DNC - 12 - i * 7, fps, config: {damping: 16, stiffness: 140}});
            return (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '13px 16px',
                  borderRadius: 12,
                  background: 'rgba(200,232,154,0.10)',
                  border: '1px solid rgba(200,232,154,0.22)',
                  color: PAPER,
                  fontSize: 22,
                  fontWeight: 600,
                  opacity: chipIn,
                  transform: `scale(${0.9 + chipIn * 0.1})`,
                }}
              >
                <span style={{color: STOP, fontWeight: 800, fontSize: 22, filter: 'brightness(1.35)'}}>✕</span>
                {item}
              </div>
            );
          })}
        </div>
        <div style={{fontFamily: MONO, fontSize: 16, color: WASH, opacity: 0.65, marginTop: 16, letterSpacing: 1}}>
          {'▸ '}match op domein óf contactpersoon = direct uit de campagne
        </div>
      </div>

      {/* ---------- Split: passed / excluded ---------- */}
      <SplitFlow frame={frame} />

      <div
        style={{
          position: 'absolute',
          top: SPLIT_TOP + 40,
          left: X,
          width: 400,
          opacity: splitIn,
          fontFamily: MONO,
          fontSize: 19,
          color: DEEP,
          fontWeight: 700,
          letterSpacing: 0.5,
        }}
      >
        ✓ Geen match · {nl(passedCount)} ↓
      </div>

      <div
        style={{
          position: 'absolute',
          top: SPLIT_TOP + 26,
          right: X,
          padding: '10px 18px',
          borderRadius: 12,
          background: STOP_WASH,
          border: `1px solid ${STOP}55`,
          color: STOP,
          fontFamily: MONO,
          fontSize: 19,
          fontWeight: 700,
          opacity: splitIn,
          transform: `translateX(${(1 - splitIn) * 20}px)`,
        }}
      >
        ✕ Match · {nl(excludedCount)} uitgesloten
      </div>

      {/* ---------- Human in the loop ---------- */}
      <div
        style={{
          position: 'absolute',
          top: HITL_TOP,
          left: X,
          width: W,
          borderRadius: 22,
          background: CARD,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 14px 40px rgba(15,42,29,0.08)',
          padding: '22px 26px 16px',
          boxSizing: 'border-box',
          opacity: hitlIn,
          transform: `translateY(${(1 - hitlIn) * 18}px)`,
          overflow: 'hidden',
        }}
      >
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: SPROUT}} />
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10}}>
          <div style={{fontSize: 30, fontWeight: 800, letterSpacing: -0.6}}>Human-in-the-loop</div>
          <div style={{fontFamily: MONO, fontSize: 17, color: FAINT, letterSpacing: 2}}>VIA SLACK</div>
        </div>
        {HITL_STEPS.map((s, i) => {
          const rowIn = spring({frame: frame - T_HITL - 14 - i * 14, fps, config: {damping: 200}});
          const isLast = i === HITL_STEPS.length - 1;
          return (
            <div
              key={s.title}
              style={{
                height: HITL_ROW,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                borderTop: i === 0 ? 'none' : `1px solid ${BORDER}`,
                opacity: rowIn,
                transform: `translateX(${(1 - rowIn) * -18}px)`,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: isLast ? DEEP : WASH,
                  color: isLast ? PAPER : INK,
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 17,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                0{i + 1}
              </div>
              <div style={{fontSize: 25, fontWeight: 700, letterSpacing: -0.3}}>{s.title}</div>
              <div style={{fontSize: 20, color: DEEP, opacity: 0.85}}>{s.sub}</div>
              {isLast ? (
                <div
                  style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 16px',
                    borderRadius: 10,
                    background: SPROUT,
                    color: INK,
                    fontWeight: 800,
                    fontSize: 19,
                    opacity: approve,
                    transform: `scale(${0.6 + approve * 0.4})`,
                    boxShadow: `0 0 0 ${approve * 5}px rgba(116,189,31,0.22)`,
                  }}
                >
                  ✓ Goedgekeurd
                </div>
              ) : null}
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
          bottom: FOOTER_BOTTOM,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: MONO,
          fontSize: 19,
          letterSpacing: 0.5,
          color: FAINT,
          opacity: interpolate(frame, [T_FOOTER, T_FOOTER + 20], [0, 1], clamp),
        }}
      >
        <div>
          Automatisering = <span style={{color: DEEP, fontWeight: 700}}>schaal & snelheid</span>
        </div>
        <div>
          DNC list = <span style={{color: DEEP, fontWeight: 700}}>reputatie</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/*  Leads leaving the filter: most go down-left to review, some are   */
/*  diverted right and stopped.                                        */
/* ------------------------------------------------------------------ */
const SplitFlow: React.FC<{frame: number}> = ({frame}) => {
  const startX = 540;
  const startY = SPLIT_TOP;
  const passEnd = {x: startX, y: HITL_TOP};
  const stopEnd = {x: 1080 - X - 150, y: SPLIT_TOP + 30};

  const pathsIn = interpolate(frame, [T_FLOW - 12, T_FLOW + 6], [0, 1], clamp);
  const passPath = `M${startX},${startY} C${startX},${startY + 60} ${passEnd.x},${passEnd.y - 70} ${passEnd.x},${passEnd.y}`;
  const stopPath = `M${startX},${startY} C${startX + 30},${startY + 30} ${stopEnd.x - 120},${stopEnd.y} ${stopEnd.x - 64},${stopEnd.y}`;

  const dots = new Array(18).fill(0).map((_, i) => {
    const t0 = T_FLOW + i * 5;
    const p = interpolate(frame, [t0, t0 + 24], [0, 1], clamp);
    const stopped = i % 5 === 2;
    const visible = frame >= t0 && p < 1;
    const e = p * p * (3 - 2 * p);
    let x: number;
    let y: number;
    if (stopped) {
      const [p0, p1, p2, p3] = [
        {x: startX, y: startY},
        {x: startX + 30, y: startY + 30},
        {x: stopEnd.x - 120, y: stopEnd.y},
        {x: stopEnd.x - 64, y: stopEnd.y},
      ];
      x = bez(e, p0.x, p1.x, p2.x, p3.x);
      y = bez(e, p0.y, p1.y, p2.y, p3.y);
    } else {
      x = bez(e, startX, startX, passEnd.x, passEnd.x);
      y = bez(e, startY, startY + 60, passEnd.y - 70, passEnd.y);
    }
    return {x, y, stopped, visible, i};
  });

  return (
    <svg
      width={1080}
      height={1350}
      style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}
    >
      <path d={passPath} stroke={DEEP} strokeWidth={3} fill="none" opacity={0.5 * pathsIn} />
      <path
        d={stopPath}
        stroke={STOP}
        strokeWidth={3}
        strokeDasharray="7 7"
        fill="none"
        opacity={0.6 * pathsIn}
      />
      {dots
        .filter((d) => d.visible)
        .map((d) => (
          <circle
            key={d.i}
            cx={d.x}
            cy={d.y}
            r={8}
            fill={d.stopped ? STOP : SPROUT}
            stroke={PAPER}
            strokeWidth={2}
          />
        ))}
    </svg>
  );
};

const bez = (t: number, a: number, b: number, c: number, d: number) => {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};
