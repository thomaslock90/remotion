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
// Semantic "noise" colour: marks where a version deviates
const STOP = '#C4532F';
const STOP_WASH = '#F7E3DA';

const SANS =
  '"Helvetica Neue", Helvetica, "Liberation Sans", "DejaVu Sans", Arial, sans-serif';
const MONO =
  '"SF Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace';

/* ------------------------------------------------------------------ */
/*  Content (example ICP versions; deviating parts are marked)         */
/* ------------------------------------------------------------------ */
type Part = {t: string; off?: boolean};
const VOICES: {who: string; parts: Part[]; rot: number; dx: number}[] = [
  {who: 'SALES', parts: [{t: 'SaaS'}, {t: '50–200 FTE'}, {t: 'Benelux + UK', off: true}], rot: -2.2, dx: 0},
  {who: 'CUSTOMER SUCCESS', parts: [{t: 'SaaS'}, {t: '20–100 FTE', off: true}, {t: 'Benelux'}], rot: 1.6, dx: 34},
  {who: 'MANAGEMENT', parts: [{t: 'SaaS + fintech', off: true}, {t: '50–200 FTE'}, {t: 'Europa', off: true}], rot: -1.2, dx: 10},
  {who: 'CRM · CLOSED-WON', parts: [{t: 'SaaS'}, {t: '80–250 FTE', off: true}, {t: 'Benelux + DACH', off: true}], rot: 2, dx: 40},
];

const ONE_PAGER = ['Sector & segment', 'Bedrijfsgrootte', 'Beslisser & koper', 'Koopsignalen', 'Waarom we winnen'];

const MOVES = [
  {n: '01', t: 'Eén pagina, groot aan de muur', s: 'je ideale klant en focus, die iedereen kent'},
  {n: '02', t: 'Kort en vast afstemmen', s: 'wekelijks pipeline-overleg: ruis valt sneller op'},
  {n: '03', t: 'Zie het als verandermanagement', s: 'sales werkt pas anders als ze meegenomen zijn'},
];

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */
const X = 80;
const MID_TOP = 352;
const VOICE_W = 500;
const VOICE_H = 112;
const VOICE_GAP = 22;
const CARD_X = 650;
const CARD_W = 1080 - X - CARD_X;
const CARD_H = 4 * VOICE_H + 3 * VOICE_GAP;
const MOVES_TOP = MID_TOP + CARD_H + 78;

/* Timeline (30 fps, 450 frames) */
const T_VOICES = 26;
const T_LINES = 150;
const T_CARD = 170;
const T_CALM = 200;
const T_MOVES = 270;
const T_FOOTER = 360;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ------------------------------------------------------------------ */

export const IcpNoise: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logoIn = spring({frame: frame - 2, fps, config: {damping: 14, stiffness: 90, mass: 0.9}});
  const headIn = spring({frame: frame - 4, fps, config: {damping: 200}});
  const cardIn = spring({frame: frame - T_CARD, fps, config: {damping: 200}});
  // Noise: voices jitter until the one-pager lands, then settle
  const noise = interpolate(frame, [T_VOICES, T_VOICES + 20, T_CALM, T_CALM + 30], [0, 1, 1, 0], clamp);
  const settled = interpolate(frame, [T_CALM, T_CALM + 30], [0, 1], clamp);

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
          right: 300,
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
          VOORDAT JE IETS BOUWT
        </div>
        <div style={{fontSize: 54, fontWeight: 800, lineHeight: 1.07, letterSpacing: -1.4}}>
          Eerst één antwoord:
          <br />
          <span style={{background: WASH, padding: '0 12px', borderRadius: 10}}>voor wie</span> doen we dit?
        </div>
      </div>

      {/* ---------- Section labels ---------- */}
      <div
        style={{
          position: 'absolute',
          top: MID_TOP - 38,
          left: X,
          fontFamily: MONO,
          fontSize: 16,
          letterSpacing: 2.5,
          color: STOP,
          opacity: interpolate(frame, [T_VOICES, T_VOICES + 15], [0, 1], clamp),
        }}
      >
        RUIS · 4 NET-IETS-ANDERE VERSIES
      </div>
      <div
        style={{
          position: 'absolute',
          top: MID_TOP - 38,
          left: CARD_X,
          fontFamily: MONO,
          fontSize: 16,
          letterSpacing: 2.5,
          color: DEEP,
          opacity: cardIn,
        }}
      >
        FOCUS · ÉÉN VERSIE
      </div>

      {/* ---------- Connectors ---------- */}
      <Connectors frame={frame} />

      {/* ---------- Voices ---------- */}
      {VOICES.map((v, i) => {
        const pop = spring({frame: frame - T_VOICES - i * 16, fps, config: {damping: 13, stiffness: 140}});
        const jx = Math.sin(frame / 3.1 + i * 1.7) * 3 * noise;
        const jy = Math.cos(frame / 2.7 + i * 2.3) * 2.5 * noise;
        const rot = v.rot * (1 - settled * 0.7) + Math.sin(frame / 4 + i) * 0.6 * noise;
        return (
          <div
            key={v.who}
            style={{
              position: 'absolute',
              top: MID_TOP + i * (VOICE_H + VOICE_GAP),
              left: X + v.dx * (1 - settled),
              width: VOICE_W - 40,
              height: VOICE_H,
              boxSizing: 'border-box',
              padding: '0 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: 16,
              background: CARD,
              border: `1px solid ${BORDER}`,
              boxShadow: '0 10px 26px rgba(15,42,29,0.07)',
              opacity: pop,
              transform: `translate(${jx}px, ${jy}px) rotate(${rot}deg) scale(${0.85 + pop * 0.15})`,
            }}
          >
            <div style={{fontFamily: MONO, fontSize: 15, fontWeight: 800, letterSpacing: 2, color: FAINT}}>
              {v.who}
            </div>
            <div style={{display: 'flex', gap: 5, marginTop: 12, alignItems: 'center'}}>
              {v.parts.map((p, k) => (
                <React.Fragment key={k}>
                  {k > 0 ? <span style={{color: FAINT, fontSize: 17}}>·</span> : null}
                  <span
                    style={{
                      fontSize: 19,
                      fontWeight: 700,
                      padding: '2px 6px',
                      whiteSpace: 'nowrap',
                      borderRadius: 6,
                      background: p.off ? STOP_WASH : 'transparent',
                      color: p.off ? STOP : INK,
                    }}
                  >
                    {p.t}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        );
      })}

      {/* ---------- One-pager ---------- */}
      <div
        style={{
          position: 'absolute',
          top: MID_TOP,
          left: CARD_X,
          width: CARD_W,
          height: CARD_H,
          boxSizing: 'border-box',
          padding: '24px 24px',
          borderRadius: 22,
          background: INK,
          color: PAPER,
          boxShadow: '0 22px 50px rgba(15,42,29,0.24)',
          opacity: cardIn,
          transform: `translateY(${(1 - cardIn) * 20}px) scale(${0.94 + cardIn * 0.06})`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{fontSize: 30, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.1}}>Onze ideale klant</div>
        <div style={{fontFamily: MONO, fontSize: 15, color: WASH, marginTop: 6, letterSpacing: 1}}>1 PAGINA · AAN DE MUUR</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 17, marginTop: 26}}>
          {ONE_PAGER.map((l, k) => {
            const tick = spring({frame: frame - T_CARD - 12 - k * 7, fps, config: {damping: 14, stiffness: 140}});
            return (
              <div key={l} style={{display: 'flex', alignItems: 'center', gap: 12, opacity: tick}}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: SPROUT,
                    color: INK,
                    fontSize: 15,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `scale(${0.5 + tick * 0.5})`,
                  }}
                >
                  ✓
                </div>
                <div style={{fontSize: 23, fontWeight: 650}}>{l}</div>
              </div>
            );
          })}
        </div>
        <div style={{flex: 1}} />
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 12,
            background: 'rgba(200,232,154,0.12)',
            border: '1px solid rgba(200,232,154,0.3)',
            fontSize: 17,
            lineHeight: 1.35,
            color: WASH,
          }}
        >
          ↻ Elk kwartaal: bevestigt de closed-won data dit nog?
        </div>
      </div>

      {/* ---------- Harnish moves ---------- */}
      <div
        style={{
          position: 'absolute',
          top: MOVES_TOP - 36,
          left: X,
          fontFamily: MONO,
          fontSize: 16,
          letterSpacing: 2.5,
          color: DEEP,
          opacity: interpolate(frame, [T_MOVES, T_MOVES + 15], [0, 1], clamp),
        }}
      >
        ZO HOUD JE HET SCHERP · NAAR SCALING UP (VERNE HARNISH)
      </div>
      <div style={{position: 'absolute', top: MOVES_TOP, left: X, right: X, display: 'flex', gap: 18}}>
        {MOVES.map((m, i) => {
          const inn = spring({frame: frame - T_MOVES - 8 - i * 14, fps, config: {damping: 200}});
          return (
            <div
              key={m.n}
              style={{
                flex: 1,
                padding: '22px 20px 26px',
                borderRadius: 18,
                background: CARD,
                border: `1px solid ${BORDER}`,
                boxShadow: '0 10px 26px rgba(15,42,29,0.06)',
                opacity: inn,
                transform: `translateY(${(1 - inn) * 16}px)`,
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  fontFamily: MONO,
                  fontSize: 16,
                  fontWeight: 800,
                  background: WASH,
                  padding: '4px 9px',
                  borderRadius: 7,
                }}
              >
                {m.n}
              </div>
              <div style={{fontSize: 23, fontWeight: 800, letterSpacing: -0.3, marginTop: 12, lineHeight: 1.15}}>{m.t}</div>
              <div style={{fontSize: 18, color: DEEP, marginTop: 8, lineHeight: 1.3}}>{m.s}</div>
            </div>
          );
        })}
      </div>

      {/* ---------- Footer question ---------- */}
      <div
        style={{
          position: 'absolute',
          left: X,
          right: X,
          bottom: 64,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontSize: 24,
          fontWeight: 700,
          opacity: interpolate(frame, [T_FOOTER, T_FOOTER + 20], [0, 1], clamp),
        }}
      >
        <span style={{width: 32, height: 2, background: SPROUT, flexShrink: 0}} />
        Vraag vijf collega’s wie jullie ideale klant is. Hoeveel antwoorden krijg je?
      </div>
    </AbsoluteFill>
  );
};

/* Lines from every voice into the one-pager */
const Connectors: React.FC<{frame: number}> = ({frame}) => {
  const draw = interpolate(frame, [T_LINES, T_LINES + 30], [0, 1], clamp);
  const x0 = X + VOICE_W - 40 + 6;
  const x1 = CARD_X - 4;
  const yTarget = MID_TOP + CARD_H / 2;
  const len = 260;
  return (
    <svg width={1080} height={1350} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      {VOICES.map((_, i) => {
        const y0 = MID_TOP + i * (VOICE_H + VOICE_GAP) + VOICE_H / 2;
        return (
          <path
            key={i}
            d={`M${x0},${y0} C${x0 + 60},${y0} ${x1 - 60},${yTarget} ${x1},${yTarget}`}
            stroke={SPROUT}
            strokeWidth={3}
            fill="none"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - draw)}
            opacity={0.75}
          />
        );
      })}
    </svg>
  );
};
