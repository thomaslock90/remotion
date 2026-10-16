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
const VOICE_W = 500;
const CARD_X = 650;
const CARD_W = 1080 - X - CARD_X;

// Vertical rhythm per format: 4:5 (1080x1350) and 1:1 (1080x1080)
type Layout = {
  midTop: number;
  voiceH: number;
  voiceGap: number;
  cardH: number;
  movesTop: number;
  logoTop: number;
  logoH: number;
  headTop: number;
  titleSize: number;
  footerBottom: number;
  footerSize: number;
  movesPad: string;
  oneGap: number;
  oneTop: number;
};
const makeLayout = (l: Omit<Layout, 'cardH' | 'movesTop'> & {movesGap: number}): Layout => {
  const cardH = 4 * l.voiceH + 3 * l.voiceGap;
  return {...l, cardH, movesTop: l.midTop + cardH + l.movesGap};
};
const TALL = makeLayout({
  midTop: 352, voiceH: 112, voiceGap: 22, movesGap: 78, logoTop: 86, logoH: 132, headTop: 124,
  titleSize: 54, footerBottom: 64, footerSize: 24, movesPad: '22px 20px 26px', oneGap: 17, oneTop: 26,
});
const SQUARE = makeLayout({
  midTop: 292, voiceH: 88, voiceGap: 14, movesGap: 64, logoTop: 52, logoH: 104, headTop: 76,
  titleSize: 50, footerBottom: 44, footerSize: 22, movesPad: '16px 18px 18px', oneGap: 9, oneTop: 16,
});

/* Timeline (30 fps, 450 frames) */
const T_VOICES = 26;
const T_LINES = 150;
const T_CARD = 170;
const T_CALM = 200;
const T_MOVES = 270;
const T_FOOTER = 360;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ------------------------------------------------------------------ */

export const IcpNoise: React.FC = () => <IcpScene loop={false} L={TALL} />;
export const IcpNoiseSquare: React.FC = () => <IcpScene loop={false} L={SQUARE} />;

// Short seamless loop for the GIF: starts and ends on the finished visual, the voices
// get noisy and settle again while data flows into the one-pager.
export const IcpLoop: React.FC = () => <IcpScene loop L={TALL} />;
export const IcpLoopSquare: React.FC = () => <IcpScene loop L={SQUARE} />;

const IcpScene: React.FC<{loop: boolean; L: Layout}> = ({loop, L}) => {
  const raw = useCurrentFrame();
  const {durationInFrames, fps: videoFps} = useVideoConfig();
  const frame = loop ? 449 : raw;
  const fps = loop ? 30 : videoFps;
  const loopT = raw / durationInFrames;
  const jt = loop ? raw * 2 : frame;

  const logoIn = spring({frame: frame - 2, fps, config: {damping: 14, stiffness: 90, mass: 0.9}});
  const headIn = spring({frame: frame - 4, fps, config: {damping: 200}});
  const cardIn = spring({frame: frame - T_CARD, fps, config: {damping: 200}});
  // Noise: voices jitter until the one-pager lands, then settle
  const noise = loop
    ? Math.sin(Math.PI * loopT) ** 2
    : interpolate(frame, [T_VOICES, T_VOICES + 20, T_CALM, T_CALM + 30], [0, 1, 1, 0], clamp);
  const settled = loop ? 1 - noise : interpolate(frame, [T_CALM, T_CALM + 30], [0, 1], clamp);

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
          top: L.logoTop,
          right: X,
          height: L.logoH,
          opacity: logoIn,
          transform: `scale(${0.85 + logoIn * 0.15})`,
          transformOrigin: 'top right',
        }}
      />

      {/* ---------- Header ---------- */}
      <div
        style={{
          position: 'absolute',
          top: L.headTop,
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
        <div style={{fontSize: L.titleSize, fontWeight: 800, lineHeight: 1.07, letterSpacing: -1.4}}>
          Eerst één antwoord:
          <br />
          <span style={{background: WASH, padding: '0 12px', borderRadius: 10}}>voor wie</span> doen we dit?
        </div>
      </div>

      {/* ---------- Section labels ---------- */}
      <div
        style={{
          position: 'absolute',
          top: L.midTop - 38,
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
          top: L.midTop - 38,
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
      <Connectors frame={frame} flow={loop ? loopT : null} L={L} />

      {/* ---------- Voices ---------- */}
      {VOICES.map((v, i) => {
        const pop = spring({frame: frame - T_VOICES - i * 16, fps, config: {damping: 13, stiffness: 140}});
        const jx = Math.sin(jt / 3.1 + i * 1.7) * 3 * noise;
        const jy = Math.cos(jt / 2.7 + i * 2.3) * 2.5 * noise;
        const rot = v.rot * (1 - settled * 0.7) + Math.sin(jt / 4 + i) * 0.6 * noise;
        return (
          <div
            key={v.who}
            style={{
              position: 'absolute',
              top: L.midTop + i * (L.voiceH + L.voiceGap),
              left: X + v.dx * (1 - settled),
              width: VOICE_W - 40,
              height: L.voiceH,
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
          top: L.midTop,
          left: CARD_X,
          width: CARD_W,
          height: L.cardH,
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
        <div style={{display: 'flex', flexDirection: 'column', gap: L.oneGap, marginTop: L.oneTop}}>
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
          top: L.movesTop - 36,
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
      <div style={{position: 'absolute', top: L.movesTop, left: X, right: X, display: 'flex', gap: 18}}>
        {MOVES.map((m, i) => {
          const inn = spring({frame: frame - T_MOVES - 8 - i * 14, fps, config: {damping: 200}});
          return (
            <div
              key={m.n}
              style={{
                flex: 1,
                padding: L.movesPad,
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
          bottom: L.footerBottom,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontSize: L.footerSize,
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
const Connectors: React.FC<{frame: number; flow: number | null; L: Layout}> = ({frame, flow, L}) => {
  const draw = interpolate(frame, [T_LINES, T_LINES + 30], [0, 1], clamp);
  const x0 = X + VOICE_W - 40 + 6;
  const x1 = CARD_X - 4;
  const yTarget = L.midTop + L.cardH / 2;
  const len = 260;
  return (
    <svg width={1080} height={1350} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      {VOICES.map((_, i) => {
        const y0 = L.midTop + i * (L.voiceH + L.voiceGap) + L.voiceH / 2;
        return (
          <path
            key={i}
            d={`M${x0},${y0} C${x0 + 60},${y0} ${x1 - 60},${yTarget} ${x1},${yTarget}`}
            stroke={SPROUT}
            strokeWidth={3}
            fill="none"
            // In the loop the line becomes a moving dash pattern; 4 whole periods keep it seamless
            strokeDasharray={flow === null ? len : '14 10'}
            strokeDashoffset={flow === null ? len * (1 - draw) : -flow * 24 * 4}
            opacity={0.75}
          />
        );
      })}
    </svg>
  );
};
