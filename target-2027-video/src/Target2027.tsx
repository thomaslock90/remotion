import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {TransitionSeries, linearTiming, type TransitionPresentation} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';

/* ------------------------------------------------------------------ */
/*  sowly.ai brand palette + type                                      */
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

const X = 84;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const nl = (n: number, digits = 0) =>
  n.toLocaleString('nl-NL', {minimumFractionDigits: digits, maximumFractionDigits: digits});

/* ------------------------------------------------------------------ */
/*  Example funnel (deliberately different numbers than the post)      */
/* ------------------------------------------------------------------ */
const TARGET = 750_000;
const DEAL = 25_000;
const WIN = 4; // 1 in 4 proposals won
const MEET_TO_PROPOSAL = 0.4;
const WEEKS = 46;
const DEALS = TARGET / DEAL; // 30
const PROPOSALS = DEALS * WIN; // 120
const MEETINGS = PROPOSALS / MEET_TO_PROPOSAL; // 300
const PER_WEEK = MEETINGS / WEEKS; // 6.5
const NOW_PER_WEEK = 3;

/* ------------------------------------------------------------------ */
/*  Motion helpers                                                     */
/* ------------------------------------------------------------------ */
const useSpring = (delay: number, bouncy = false) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: bouncy ? {damping: 11, stiffness: 160, mass: 0.7} : {damping: 200, stiffness: 160},
  });
};
const In: React.FC<{d: number; children: React.ReactNode; style?: React.CSSProperties}> = ({d, children, style}) => {
  const p = useSpring(d);
  return <div style={{...style, opacity: p, transform: `translateY(${(1 - p) * 24}px)`}}>{children}</div>;
};
const Pop: React.FC<{d: number; children: React.ReactNode; style?: React.CSSProperties}> = ({d, children, style}) => {
  const p = useSpring(d, true);
  return <div style={{...style, opacity: Math.min(1, p * 1.5), transform: `scale(${0.7 + 0.3 * p})`}}>{children}</div>;
};

/* ------------------------------------------------------------------ */
/*  Frame                                                              */
/* ------------------------------------------------------------------ */
type Tone = 'paper' | 'ink' | 'sprout';
const Frame: React.FC<{tone: Tone; step: string | null; children: React.ReactNode}> = ({tone, step, children}) => {
  const dark = tone === 'ink';
  return (
    <AbsoluteFill
      style={{background: tone === 'ink' ? INK : tone === 'sprout' ? SPROUT : PAPER, color: dark ? PAPER : INK, fontFamily: SANS, overflow: 'hidden'}}
    >
      {tone === 'paper' ? (
        <AbsoluteFill
          style={{
            opacity: 0.6,
            backgroundImage:
              'linear-gradient(rgba(15,42,29,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,42,29,0.04) 1px, transparent 1px)',
            backgroundSize: '54px 54px',
          }}
        />
      ) : null}
      {dark ? <AbsoluteFill style={{background: 'radial-gradient(80% 60% at 85% 0%, rgba(116,189,31,0.25), transparent 60%)'}} /> : null}
      <Img src={staticFile('sowly-logo.png')} style={{position: 'absolute', top: 52, right: X, height: 74, filter: dark ? 'brightness(0) invert(0.97)' : 'none'}} />
      {step ? (
        <div
          style={{
            position: 'absolute',
            top: 70,
            left: X,
            fontFamily: MONO,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 4,
            padding: '8px 14px',
            borderRadius: 10,
            background: dark ? SPROUT : INK,
            color: dark ? INK : PAPER,
          }}
        >
          {step}
        </div>
      ) : null}
      {children}
    </AbsoluteFill>
  );
};

const Byline: React.FC<{dark: boolean}> = ({dark}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
    <Img src={staticFile('thomas.jpg')} style={{width: 64, height: 64, borderRadius: 32, objectFit: 'cover', boxShadow: `0 0 0 3px ${SPROUT}`}} />
    <div>
      <div style={{fontSize: 22, fontWeight: 800}}>Thomas Lock</div>
      <div style={{fontSize: 17, fontWeight: 600, color: dark ? WASH : DEEP}}>GTM & RevOps architect · Sowly.ai</div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  1 — Hook (also the thumbnail: fully visible from frame 0)          */
/* ------------------------------------------------------------------ */
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 5) * 0.06;
  const sweep = (frame % 45) / 45;
  return (
    <Frame tone="ink" step="PLANNING 2027">
      <div style={{position: 'absolute', left: X, right: X, top: 210}}>
        <div style={{fontSize: 34, fontWeight: 700, color: WASH}}>Stel, je omzetdoel is</div>
        <div style={{position: 'relative', display: 'inline-block', fontSize: 210, fontWeight: 800, letterSpacing: -8, lineHeight: 1, marginTop: 6}}>
          €750k
          <div style={{position: 'absolute', left: 0, right: 0, bottom: -6, height: 8, borderRadius: 4, background: 'rgba(116,189,31,0.25)', overflow: 'hidden'}}>
            <div style={{width: '35%', height: '100%', background: SPROUT, borderRadius: 4, transform: `translateX(${-100 + sweep * 390}%)`}} />
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 50}}>
          <div style={{fontSize: 64, fontWeight: 800, letterSpacing: -2}}>=</div>
          <div
            style={{
              width: 128,
              height: 128,
              borderRadius: 64,
              background: SPROUT,
              color: INK,
              fontSize: 92,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${pulse})`,
              boxShadow: `0 0 ${30 * pulse}px rgba(116,189,31,0.55)`,
            }}
          >
            ?
          </div>
          <div style={{fontSize: 50, fontWeight: 800, letterSpacing: -1.2, lineHeight: 1.05}}>
            eerste gesprekken
            <br />
            <span style={{color: SPROUT}}>per week</span>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: X, right: X, bottom: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Byline dark />
        <div style={{fontFamily: MONO, fontSize: 22, fontWeight: 800, color: SPROUT, letterSpacing: 2}}>REKEN MEE →</div>
      </div>
    </Frame>
  );
};

/* ------------------------------------------------------------------ */
/*  2 — Work the target back through the funnel                        */
/* ------------------------------------------------------------------ */
const ROWS = [
  {op: 'Omzetdoel', val: TARGET, unit: '', euro: true, digits: 0},
  {op: `÷ €${nl(DEAL / 1000)}k per deal`, val: DEALS, unit: 'deals', euro: false, digits: 0},
  {op: `× ${WIN}: je wint 1 op de ${WIN} voorstellen`, val: PROPOSALS, unit: 'voorstellen', euro: false, digits: 0},
  {op: `÷ ${MEET_TO_PROPOSAL * 100}%: zoveel gesprekken worden een voorstel`, val: MEETINGS, unit: 'gesprekken', euro: false, digits: 0},
  {op: `÷ ${WEEKS} werkweken`, val: PER_WEEK, unit: 'per week', euro: false, digits: 1},
];
const ROW_AT = (i: number) => 18 + i * 28;

const Calc: React.FC = () => {
  const frame = useCurrentFrame();
  const bars = useSpring(170);
  const gap = useSpring(196, true);
  return (
    <Frame tone="paper" step="VAN DOEL NAAR AGENDA">
      <In d={2} style={{position: 'absolute', left: X, right: X, top: 160}}>
        <div style={{fontSize: 54, fontWeight: 800, letterSpacing: -1.6, lineHeight: 1.05}}>
          Reken het doel terug tot <span style={{background: WASH, padding: '0 10px', borderRadius: 10}}>je agenda.</span>
        </div>
      </In>
      <div style={{position: 'absolute', left: X, right: X, top: 262, display: 'flex', flexDirection: 'column', gap: 10}}>
        {ROWS.map((r, i) => {
          const last = i === ROWS.length - 1;
          const v = interpolate(frame, [ROW_AT(i) + 4, ROW_AT(i) + 22], [0, r.val], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 3)});
          return (
            <Pop key={r.op} d={ROW_AT(i)}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: 74,
                  padding: '0 24px',
                  borderRadius: 16,
                  background: last ? INK : CARD,
                  color: last ? PAPER : INK,
                  border: last ? 'none' : `1px solid ${BORDER}`,
                  boxShadow: last ? '0 14px 30px rgba(15,42,29,0.22)' : 'none',
                }}
              >
                <div style={{fontSize: 23, fontWeight: 700, color: last ? WASH : DEEP}}>{r.op}</div>
                <div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
                  <span style={{fontSize: last ? 46 : 36, fontWeight: 800, letterSpacing: -1, color: last ? SPROUT : INK}}>
                    {r.euro ? '€' : ''}
                    {nl(v, r.digits)}
                  </span>
                  <span style={{fontSize: 20, fontWeight: 700, color: last ? WASH : FAINT}}>{r.unit}</span>
                </div>
              </div>
            </Pop>
          );
        })}
      </div>

      {/* Compare with today */}
      <div style={{position: 'absolute', left: X, right: X, top: 708, opacity: bars}}>
        {[
          {label: 'Nodig', v: PER_WEEK, c: SPROUT},
          {label: 'Nu (voorbeeld)', v: NOW_PER_WEEK, c: STOP},
        ].map((b) => (
          <div key={b.label} style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12}}>
            <div style={{width: 190, fontSize: 22, fontWeight: 700}}>{b.label}</div>
            <div style={{flex: 1, height: 30, borderRadius: 15, background: 'rgba(15,42,29,0.06)'}}>
              <div style={{width: `${(b.v / PER_WEEK) * 100 * bars}%`, height: '100%', borderRadius: 15, background: b.c}} />
            </div>
            <div style={{width: 120, textAlign: 'right', fontSize: 26, fontWeight: 800}}>{nl(b.v, b.v % 1 ? 1 : 0)}/wk</div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: X,
          right: X,
          top: 822,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          opacity: gap,
          transform: `scale(${0.85 + 0.15 * gap})`,
          transformOrigin: 'left center',
        }}
      >
        <div style={{padding: '12px 18px', borderRadius: 14, background: STOP_WASH, color: STOP, fontSize: 30, fontWeight: 800}}>
          Ruim 2× te weinig
        </div>
        <div style={{fontSize: 28, fontWeight: 800}}>Daar zit je knelpunt, niet in je tooling.</div>
      </div>
      <div style={{position: 'absolute', left: X, bottom: 56, fontFamily: MONO, fontSize: 18, color: FAINT, letterSpacing: 1}}>
        REKENVOORBEELD · ZET ER JE EIGEN CIJFERS IN
      </div>
    </Frame>
  );
};

/* ------------------------------------------------------------------ */
/*  3 — The four steps as a staircase                                  */
/* ------------------------------------------------------------------ */
const STEPS = [
  {n: 1, t: 'Diagnose', s: 'waar sta je?'},
  {n: 2, t: 'Plan', s: 'kiezen is ook nee zeggen'},
  {n: 3, t: 'Testen', s: 'klein en met de hand'},
  {n: 4, t: 'Opschalen', s: 'pas als de cijfers er zijn'},
];
const Stairs: React.FC = () => {
  const frame = useCurrentFrame();
  const climb = interpolate(frame, [128, 186], [0, 4], clamp); // lights steps 1 → 4
  const redP = useSpring(70, true);
  const greenP = useSpring(104, true);
  return (
    <Frame tone="ink" step="DE VOLGORDE">
      <In d={2} style={{position: 'absolute', left: X, right: X, top: 160}}>
        <div style={{fontSize: 54, fontWeight: 800, letterSpacing: -1.6, lineHeight: 1.05}}>
          Een plan is een trap.
          <br />
          <span style={{color: SPROUT}}>Begin bij de onderste tree.</span>
        </div>
      </In>
      {STEPS.map((st, i) => {
        const top = 820 - i * 128;
        const left = X + i * 34;
        const lit = Math.min(1, Math.max(0, climb - i));
        const isFour = st.n === 4;
        return (
          <Pop key={st.n} d={14 + i * 10} style={{position: 'absolute', top, left, width: 1080 - 2 * X - i * 34}}>
            <div
              style={{
                height: 108,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                padding: '0 20px',
                borderRadius: 18,
                background: `rgba(116,189,31,${0.06 + lit * 0.9})`,
                border: `2px solid rgba(200,232,154,${0.25 + lit * 0.5})`,
                color: lit > 0.5 ? INK : PAPER,
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 14,
                  background: lit > 0.5 ? INK : SPROUT,
                  color: lit > 0.5 ? SPROUT : INK,
                  fontFamily: MONO,
                  fontSize: 28,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {st.n}
              </div>
              <div>
                <div style={{fontSize: 34, fontWeight: 800, letterSpacing: -0.6}}>{st.t}</div>
                <div style={{fontSize: 21, fontWeight: 600, color: lit > 0.5 ? INK : WASH, opacity: 0.9}}>{st.s}</div>
              </div>
              <div style={{flex: 1}} />
              {isFour ? (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: STOP_WASH,
                    color: STOP,
                    fontSize: 19,
                    fontWeight: 800,
                    opacity: redP * (1 - lit),
                    transform: `scale(${0.6 + 0.4 * redP})`,
                    textAlign: 'right',
                    lineHeight: 1.2,
                  }}
                >
                  ✕ Hier starten de meeste plannen
                  <br />
                  <span style={{fontWeight: 600}}>nieuwe hire, nieuwe tool</span>
                </div>
              ) : null}
              {st.n === 1 ? (
                <div
                  style={{
                    padding: '10px 16px',
                    borderRadius: 12,
                    background: lit > 0.5 ? INK : SPROUT,
                    color: lit > 0.5 ? SPROUT : INK,
                    fontSize: 22,
                    fontWeight: 800,
                    opacity: greenP,
                    transform: `scale(${0.6 + 0.4 * greenP})`,
                  }}
                >
                  ✓ Start hier
                </div>
              ) : null}
            </div>
          </Pop>
        );
      })}
    </Frame>
  );
};

/* ------------------------------------------------------------------ */
/*  4 — Hand-off to the post                                           */
/* ------------------------------------------------------------------ */
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 5) * 8;
  return (
    <Frame tone="sprout" step={null}>
      <div style={{position: 'absolute', left: X, right: X, top: 200}}>
        <In d={2}>
          <div style={{fontSize: 40, fontWeight: 700, lineHeight: 1.25}}>
            Per stap uitgewerkt, met de formule
            <br />
            en een voorbeeld uit de praktijk:
          </div>
        </In>
        <Pop d={14} style={{marginTop: 40}}>
          <div style={{fontSize: 120, fontWeight: 800, letterSpacing: -4, lineHeight: 1}}>Lees de post</div>
        </Pop>
        <div style={{fontSize: 130, fontWeight: 800, color: INK, transform: `translateY(${bob}px)`, marginTop: 10}}>↓</div>
      </div>
      <In d={24} style={{position: 'absolute', left: X, bottom: 64}}>
        <Byline dark={false} />
      </In>
    </Frame>
  );
};

/* ------------------------------------------------------------------ */
/*  Timeline                                                           */
/* ------------------------------------------------------------------ */
const T = 10;
const SCENES: {C: React.FC; dur: number}[] = [
  {C: Hook, dur: 105},
  {C: Calc, dur: 270},
  {C: Stairs, dur: 225},
  {C: Cta, dur: 120},
];
export const DURATION = SCENES.reduce((a, s) => a + s.dur, 0) - (SCENES.length - 1) * T;

// Mixed slide and wipe presentations; their prop types differ, so widen them for the list
const presentations = [
  slide({direction: 'from-right'}),
  wipe({direction: 'from-left'}),
  slide({direction: 'from-bottom'}),
] as unknown as TransitionPresentation<Record<string, unknown>>[];

export const Target2027: React.FC = () => (
  <TransitionSeries>
    {SCENES.map((s, i) => (
      <React.Fragment key={i}>
        {i > 0 ? <TransitionSeries.Transition presentation={presentations[(i - 1) % presentations.length]} timing={linearTiming({durationInFrames: T})} /> : null}
        <TransitionSeries.Sequence durationInFrames={s.dur}>
          <s.C />
        </TransitionSeries.Sequence>
      </React.Fragment>
    ))}
  </TransitionSeries>
);
