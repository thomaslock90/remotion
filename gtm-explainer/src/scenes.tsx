import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

/* ------------------------------------------------------------------ */
/*  sowly.ai brand palette + type                                      */
/* ------------------------------------------------------------------ */
export const PAPER = '#FBFAF5';
export const INK = '#0F2A1D';
export const DEEP = '#2F6B45';
export const SPROUT = '#74BD1F';
export const WASH = '#C8E89A';
export const CARD = '#FFFFFF';
export const BORDER = 'rgba(15,42,29,0.12)';
export const STOP = '#C4532F';
export const STOP_WASH = '#F7E3DA';

export const SANS =
  '"Helvetica Neue", Helvetica, "Liberation Sans", "DejaVu Sans", Arial, sans-serif';
export const MONO =
  '"SF Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace';

const X = 84;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ------------------------------------------------------------------ */
/*  Motion helpers (frames are local to each scene)                    */
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

// Slides up and fades in
const In: React.FC<{d: number; children: React.ReactNode; y?: number; style?: React.CSSProperties}> = ({
  d,
  children,
  y = 26,
  style,
}) => {
  const p = useSpring(d);
  return <div style={{...style, opacity: p, transform: `translateY(${(1 - p) * y}px)`}}>{children}</div>;
};

// Slams in: starts big, snaps to size
const Slam: React.FC<{d: number; children: React.ReactNode; style?: React.CSSProperties}> = ({d, children, style}) => {
  const p = useSpring(d, true);
  const o = useSpring(d);
  return (
    <div style={{...style, opacity: o, transform: `scale(${1.35 - 0.35 * p})`, transformOrigin: 'left center'}}>{children}</div>
  );
};

// Pops in with a bounce
const Pop: React.FC<{d: number; children: React.ReactNode; style?: React.CSSProperties}> = ({d, children, style}) => {
  const p = useSpring(d, true);
  return <div style={{...style, opacity: Math.min(1, p * 1.5), transform: `${style?.transform ?? ''} scale(${0.6 + 0.4 * p})`}}>{children}</div>;
};

/* ------------------------------------------------------------------ */
/*  Frame: background, logo, step label, seed line                     */
/* ------------------------------------------------------------------ */
type Tone = 'paper' | 'ink' | 'sprout' | 'wash';
const BG: Record<Tone, string> = {paper: PAPER, ink: INK, sprout: SPROUT, wash: WASH};
const FG: Record<Tone, string> = {paper: INK, ink: PAPER, sprout: INK, wash: INK};

const Frame: React.FC<{tone: Tone; step: string | null; seed: string | null; seedAt?: number; children: React.ReactNode}> = ({
  tone,
  step,
  seed,
  seedAt = 40,
  children,
}) => {
  const dark = tone === 'ink';
  return (
    <AbsoluteFill style={{background: BG[tone], color: FG[tone], fontFamily: SANS, overflow: 'hidden'}}>
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
      {dark ? (
        <AbsoluteFill style={{background: 'radial-gradient(80% 60% at 85% 0%, rgba(116,189,31,0.25), transparent 60%)'}} />
      ) : null}
      <Img
        src={staticFile('sowly-logo.png')}
        style={{position: 'absolute', top: 52, right: X, height: 74, filter: dark ? 'brightness(0) invert(0.97)' : 'none'}}
      />
      {step ? (
        <Pop d={0} style={{position: 'absolute', top: 70, left: X}}>
          <div
            style={{
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
        </Pop>
      ) : null}
      {children}
      {seed ? (
        <In d={seedAt} y={14} style={{position: 'absolute', left: X, right: X, bottom: 64}}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 22,
              letterSpacing: 1,
              color: dark ? WASH : DEEP,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{fontSize: 26}}>🌱</span>
            {seed}
          </div>
        </In>
      ) : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/*  Scenes                                                             */
/* ------------------------------------------------------------------ */

// 0 — Title
export const TitleScene: React.FC = () => (
  <Frame tone="ink" step={null} seed="Thomas Lock · Sowly.ai" seedAt={26}>
    <div style={{position: 'absolute', left: X, right: X, top: 230}}>
      <Pop d={0}>
        <Img
          src={staticFile('thomas.jpg')}
          style={{width: 150, height: 150, borderRadius: 75, objectFit: 'cover', boxShadow: `0 0 0 5px ${SPROUT}`}}
        />
      </Pop>
      <div style={{fontSize: 140, fontWeight: 800, lineHeight: 0.95, letterSpacing: -5, marginTop: 46}}>
        <Slam d={6}>GTM</Slam>
        <Slam d={12}>
          <span style={{color: SPROUT}}>Engineering</span>
        </Slam>
      </div>
      <In d={20}>
        <div style={{fontSize: 40, fontWeight: 700, marginTop: 30, color: WASH}}>uitgelegd in 1 minuut</div>
      </In>
    </div>
  </Frame>
);

// 1 — What is GTM
export const GtmScene: React.FC = () => {
  const steps = ['Marketing', 'Sales', 'Customer Success'];
  return (
    <Frame tone="paper" step="GO-TO-MARKET" seed={null}>
      <div style={{position: 'absolute', left: X, right: X, top: 200}}>
        <In d={4}>
          <div style={{fontSize: 72, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2}}>
            Alles tussen jouw <span style={{background: WASH, padding: '0 10px', borderRadius: 10}}>product/dienst</span> en
            een betalende klant.
          </div>
        </In>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 70}}>
          <Pop d={22}>
            <Pill dark>Product/dienst</Pill>
          </Pop>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <Pop d={28 + i * 9}>
                <Arrow />
              </Pop>
              <Pop d={30 + i * 9}>
                <Pill dark={false}>{s}</Pill>
              </Pop>
            </React.Fragment>
          ))}
          <Pop d={56}>
            <Arrow />
          </Pop>
          <Pop d={58}>
            <Pill dark green>
              Klant
            </Pill>
          </Pop>
        </div>
        <In d={80}>
          <div style={{fontSize: 34, fontWeight: 700, color: DEEP, marginTop: 70}}>Drie teams, één doel: omzet.</div>
        </In>
      </div>
    </Frame>
  );
};

const Pill: React.FC<{children: React.ReactNode; dark: boolean; green?: boolean}> = ({children, dark, green}) => (
  <div
    style={{
      padding: '16px 16px',
      borderRadius: 14,
      fontSize: 22,
      fontWeight: 800,
      background: green ? SPROUT : dark ? INK : CARD,
      color: green ? INK : dark ? PAPER : INK,
      border: dark || green ? 'none' : `1px solid ${BORDER}`,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);
const Arrow: React.FC = () => <div style={{fontSize: 30, fontWeight: 800, color: SPROUT}}>→</div>;

// 2 — The problem
export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Frame tone="paper" step="HET PROBLEEM" seed="Iedereen zaait hetzelfde zaad op hetzelfde veld." seedAt={110}>
      <div style={{position: 'absolute', left: X, right: X, top: 190}}>
        <In d={4}>
          <div style={{fontSize: 70, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2}}>
            Iedereen zoekt klanten op <span style={{color: STOP}}>dezelfde manier.</span>
          </div>
        </In>
        <div style={{display: 'flex', gap: 10, marginTop: 26}}>
          {['bedrijfsgrootte', 'sector', 'functietitel'].map((c, i) => (
            <Pop key={c} d={18 + i * 5}>
              <div style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, padding: '8px 14px', borderRadius: 10, background: STOP_WASH, color: STOP}}>
                {c}
              </div>
            </Pop>
          ))}
        </div>
      </div>
      {/* Inbox fills up in about a second */}
      <div style={{position: 'absolute', left: X, right: X, top: 560, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14}}>
        {new Array(9).fill(0).map((_, i) => (
          <Pop key={i} d={44 + i * 3} style={{transform: `rotate(${((i * 37) % 7) - 3}deg)`}}>
            <div style={{padding: '14px 16px', borderRadius: 12, background: CARD, border: `1px solid ${BORDER}`}}>
              <div style={{fontSize: 19, fontWeight: 800}}>Quick question 👋</div>
              <div style={{height: 8, borderRadius: 4, background: 'rgba(15,42,29,0.1)', marginTop: 10}} />
              <div style={{height: 8, width: '60%', borderRadius: 4, background: 'rgba(15,42,29,0.1)', marginTop: 6}} />
            </div>
          </Pop>
        ))}
      </div>
      {/* inbox counter */}
      <In d={44} style={{position: 'absolute', right: X, top: 500}}>
        <div style={{fontFamily: MONO, fontSize: 22, fontWeight: 800, color: STOP}}>
          INBOX · {Math.round(interpolate(frame, [44, 80], [0, 247], clamp))}
        </div>
      </In>
    </Frame>
  );
};

// 3 — What is GTM engineering
export const WhatScene: React.FC = () => (
  <Frame tone="sprout" step="GTM ENGINEERING" seed={null}>
    <div style={{position: 'absolute', left: X, right: X, top: 230}}>
      <Slam d={4}>
        <div style={{fontSize: 104, fontWeight: 800, lineHeight: 1, letterSpacing: -3.5}}>Niet meer mensen.</div>
      </Slam>
      <Slam d={22} style={{display: 'inline-block', marginTop: 18}}>
        <div
          style={{
            fontSize: 104,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -3.5,
            color: PAPER,
            background: INK,
            padding: '4px 22px 10px',
            borderRadius: 18,
          }}
        >
          Betere systemen.
        </div>
      </Slam>
      <In d={44}>
        <div style={{fontSize: 36, fontWeight: 700, marginTop: 50, lineHeight: 1.3}}>
          Data + AI + automatisering die laten zien
          <br />
          <b>wie</b> je benadert, <b>wanneer</b> en <b>waarom</b>.
        </div>
      </In>
    </div>
  </Frame>
);

// 4 — Unique data
export const DataScene: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [18, 30], [0, 100], clamp);
  const zoom = useSpring(40, true);
  const corners = useSpring(50);
  return (
    <Frame tone="ink" step="1 · UNIEKE DATA" seed="Weten welke grond vruchtbaar is." seedAt={90}>
      <div style={{position: 'absolute', left: X, right: X, top: 200}}>
        <In d={2}>
          <div style={{position: 'relative', display: 'inline-block', fontSize: 44, fontWeight: 700, color: 'rgba(251,250,245,0.55)'}}>
            Alle restaurants in Europa
            <div style={{position: 'absolute', left: 0, top: '52%', height: 5, width: `${strike}%`, background: STOP, borderRadius: 3}} />
          </div>
        </In>
        <In d={32}>
          <div style={{fontSize: 30, color: SPROUT, margin: '18px 0', fontWeight: 800}}>↓ inzoomen</div>
        </In>
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            opacity: Math.min(1, zoom * 1.4),
            transform: `scale(${1.7 - 0.7 * zoom})`,
            transformOrigin: 'left top',
          }}
        >
          <div style={{fontSize: 74, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2}}>
            Berlijnse cafés die <span style={{color: SPROUT}}>net zijn begonnen met bezorgen</span>
          </div>
          {[
            {left: -20, top: -20, bl: true, bt: true, dx: -1, dy: -1},
            {right: -20, top: -20, br: true, bt: true, dx: 1, dy: -1},
            {left: -20, bottom: -20, bl: true, bb: true, dx: -1, dy: 1},
            {right: -20, bottom: -20, br: true, bb: true, dx: 1, dy: 1},
          ].map((c, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 36,
                height: 36,
                left: c.left,
                right: c.right,
                top: c.top,
                bottom: c.bottom,
                opacity: corners,
                transform: `translate(${(1 - corners) * 40 * c.dx}px, ${(1 - corners) * 40 * c.dy}px)`,
                borderLeft: c.bl ? `5px solid ${SPROUT}` : undefined,
                borderRight: c.br ? `5px solid ${SPROUT}` : undefined,
                borderTop: c.bt ? `5px solid ${SPROUT}` : undefined,
                borderBottom: c.bb ? `5px solid ${SPROUT}` : undefined,
              }}
            />
          ))}
        </div>
        <In d={68}>
          <div style={{fontSize: 30, color: WASH, marginTop: 50, lineHeight: 1.35}}>
            Kijk naar je beste klanten: wat hebben zij gemeen dat concurrenten niet zien?
          </div>
        </In>
      </div>
    </Frame>
  );
};

// 5 — Signals that add up
const SIGNALS = ['Past bij je ideale klant', 'Net geld opgehaald', 'Vacature voor salesmensen', 'Bekijkt je prijzenpagina'];
const SIGNAL_AT = (i: number) => 40 + i * 34;
export const SignalsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fill =
    SIGNALS.reduce((acc, _, i) => acc + spring({frame: frame - SIGNAL_AT(i) - 4, fps, config: {damping: 14, stiffness: 120}}), 0) /
    SIGNALS.length;
  const done = useSpring(SIGNAL_AT(3) + 22, true);
  return (
    <Frame tone="paper" step="2 · SIGNALEN DIE OPTELLEN" seed="Zaaien als het weer goed is." seedAt={220}>
      <div style={{position: 'absolute', left: X, right: X, top: 180}}>
        <div style={{fontSize: 64, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2}}>
          <In d={4}>Eén signaal is geen reden.</In>
          <Slam d={SIGNAL_AT(3) + 26} style={{display: 'inline-block'}}>
            <span style={{background: WASH, padding: '0 10px', borderRadius: 10}}>Samen wel.</span>
          </Slam>
        </div>
        <div style={{display: 'flex', gap: 34, marginTop: 50, alignItems: 'flex-end'}}>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 12}}>
            {SIGNALS.map((s, i) => (
              <Pop key={s} d={SIGNAL_AT(i)}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 18px',
                    borderRadius: 14,
                    background: CARD,
                    border: `1px solid ${BORDER}`,
                    fontSize: 26,
                    fontWeight: 750,
                  }}
                >
                  <span style={{color: SPROUT, fontSize: 30, fontWeight: 800}}>+</span>
                  {s}
                </div>
              </Pop>
            ))}
          </div>
          <div style={{width: 230, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 18,
                fontWeight: 800,
                color: INK,
                background: SPROUT,
                padding: '8px 10px',
                borderRadius: 10,
                textAlign: 'center',
                marginBottom: 12,
                opacity: done,
                transform: `scale(${0.6 + 0.4 * done})`,
              }}
            >
              REDEN VOOR
              <br />
              OUTREACH ✓
            </div>
            <div
              style={{
                width: 90,
                height: 330,
                borderRadius: 45,
                background: 'rgba(15,42,29,0.08)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 0 ${done * 40}px ${done * 6}px rgba(116,189,31,0.45)`,
              }}
            >
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: `linear-gradient(0deg, ${WASH}, ${SPROUT})`}} />
              {[1, 2, 3].map((k) => (
                <div key={k} style={{position: 'absolute', left: 0, right: 0, bottom: `${k * 25}%`, height: 3, background: PAPER}} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
};

// 6 — Upsell
export const UpsellScene: React.FC = () => {
  const slide = useSpring(96, true);
  return (
    <Frame tone="wash" step="3 · GROEIEN BIJ KLANTEN" seed="Oogsten bij wat al groeit." seedAt={140}>
      <div style={{position: 'absolute', left: X, right: X, top: 190}}>
        <In d={4}>
          <div style={{fontSize: 66, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2}}>
            Je beste nieuwe omzet zit vaak al <span style={{background: INK, color: SPROUT, padding: '0 12px', borderRadius: 10}}>in je klantenbestand.</span>
          </div>
        </In>
        <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 50}}>
          {['Vraagt naar een functie uit je duurdere pakket', 'Team groeit hard: +40% gebruikers'].map((s, i) => (
            <Pop key={s} d={40 + i * 22}>
              <div style={{padding: '18px 22px', borderRadius: 16, background: CARD, fontSize: 28, fontWeight: 750, display: 'flex', gap: 14}}>
                <span style={{color: SPROUT}}>●</span>
                {s}
              </div>
            </Pop>
          ))}
          <div
            style={{
              padding: '20px 22px',
              borderRadius: 16,
              background: INK,
              color: PAPER,
              fontSize: 28,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: '0 16px 36px rgba(15,42,29,0.25)',
              opacity: slide,
              transform: `translateX(${(1 - slide) * 300}px)`,
            }}
          >
            🔔 Accountmanager: <span style={{color: SPROUT}}>tijd voor een upsell-gesprek</span>
          </div>
        </div>
      </div>
    </Frame>
  );
};

// 7 — Keep testing
export const TestScene: React.FC = () => {
  const frame = useCurrentFrame();
  const loop = ['Idee', 'Testen', 'Leren', 'Opschalen'];
  const R = 190;
  const draw = interpolate(frame, [8, 40], [0, 1], clamp);
  const active = frame < 60 ? -1 : Math.min(3, Math.floor((frame - 60) / 18));
  const circ = 2 * Math.PI * R;
  return (
    <Frame tone="ink" step="4 · BLIJVEN TESTEN" seed="Proefveldjes: wat groeit, zaai je breder." seedAt={50}>
      <In d={4} style={{position: 'absolute', left: X, right: X, top: 180}}>
        <div style={{fontSize: 64, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2}}>
          Geen aanpak werkt <span style={{color: SPROUT}}>voor altijd.</span>
        </div>
      </In>
      <div style={{position: 'absolute', left: 540 - R - 70, top: 400, width: 2 * R + 140, height: 2 * R + 140}}>
        <svg width={2 * R + 140} height={2 * R + 140} style={{position: 'absolute', inset: 0, transform: `rotate(${frame * 0.6 - 90}deg)`}}>
          <circle
            cx={R + 70}
            cy={R + 70}
            r={R}
            fill="none"
            stroke={SPROUT}
            strokeWidth={5}
            strokeDasharray={`${circ * draw} ${circ}`}
            opacity={0.75}
          />
        </svg>
        {loop.map((l, i) => {
          const a = (i / loop.length) * Math.PI * 2 - Math.PI / 2;
          const on = i === active || (i === 3 && active === 3);
          return (
            <Pop
              key={l}
              d={14 + i * 10}
              style={{position: 'absolute', left: R + 70 + Math.cos(a) * R, top: R + 70 + Math.sin(a) * R, transform: 'translate(-50%, -50%)'}}
            >
              <div
                style={{
                  padding: '14px 22px',
                  borderRadius: 14,
                  background: on ? SPROUT : PAPER,
                  color: INK,
                  fontSize: 30,
                  fontWeight: 800,
                  boxShadow: on ? '0 0 30px 6px rgba(116,189,31,0.5)' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {l}
              </div>
            </Pop>
          );
        })}
      </div>
    </Frame>
  );
};

// 8 — How Sowly does it
export const SowlyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const stats = [
    {to: 10, pre: '', suf: '+', l: 'B2B-bedrijven'},
    {to: 400, pre: '', suf: '+', l: 'salesgesprekken'},
    {to: 6, pre: '€', suf: 'M+', l: 'pipeline'},
  ];
  return (
    <Frame tone="sprout" step="ZO DOET SOWLY HET" seed={null}>
      <div style={{position: 'absolute', left: X, right: X, top: 210}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          {['Meten', 'Testen', 'Opschalen wat werkt'].map((s, i) => (
            <Slam key={s} d={4 + i * 10}>
              <div style={{fontSize: 80, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.08, whiteSpace: 'nowrap'}}>
                <span style={{color: PAPER, opacity: 0.85, fontFamily: MONO, fontSize: 40, marginRight: 18, verticalAlign: 'middle'}}>{i + 1}</span>
                {s}
              </div>
            </Slam>
          ))}
        </div>
        <div style={{display: 'flex', gap: 16, marginTop: 64}}>
          {stats.map((s, i) => {
            const v = Math.round(interpolate(frame, [44 + i * 6, 80 + i * 6], [0, s.to], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 3)}));
            return (
              <Pop key={s.l} d={40 + i * 6} style={{flex: 1}}>
                <div style={{padding: '20px 22px', borderRadius: 18, background: INK, color: PAPER}}>
                  <div style={{fontSize: 58, fontWeight: 800, letterSpacing: -1.5, color: SPROUT}}>
                    {s.pre}
                    {v}
                    {s.suf}
                  </div>
                  <div style={{fontSize: 22, fontWeight: 700, color: WASH, marginTop: 4}}>{s.l}</div>
                </div>
              </Pop>
            );
          })}
        </div>
      </div>
    </Frame>
  );
};

// 9 — Outro
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = useSpring(0);
  const pulse = 1 + Math.max(0, Math.sin((frame - 40) / 6)) * 0.05 * (frame > 40 ? 1 : 0);
  return (
    <Frame tone="paper" step={null} seed={null}>
      <div style={{position: 'absolute', left: X, right: X, top: 230, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
        <Img
          src={staticFile('thomas.jpg')}
          style={{
            width: 210,
            height: 210,
            borderRadius: 105,
            objectFit: 'cover',
            boxShadow: `0 0 0 6px ${SPROUT}, 0 20px 40px rgba(15,42,29,0.2)`,
            opacity: zoom,
            transform: `scale(${1.3 - 0.3 * zoom})`,
          }}
        />
        <In d={8}>
          <div style={{fontSize: 76, fontWeight: 800, letterSpacing: -2, marginTop: 40}}>Thomas Lock</div>
        </In>
        <In d={14}>
          <div style={{fontSize: 30, color: DEEP, fontWeight: 700, marginTop: 8}}>GTM & RevOps architect · Founder Sowly.ai</div>
        </In>
        <Pop d={24}>
          <div
            style={{
              marginTop: 56,
              padding: '22px 34px',
              borderRadius: 18,
              background: INK,
              color: PAPER,
              fontSize: 34,
              fontWeight: 800,
              display: 'flex',
              gap: 18,
              alignItems: 'center',
            }}
          >
            Volg mij voor meer GTM-plays
            <span style={{background: SPROUT, color: INK, padding: '10px 18px', borderRadius: 12, fontSize: 28, transform: `scale(${pulse})`, display: 'inline-block'}}>
              + Volgen
            </span>
          </div>
        </Pop>
      </div>
    </Frame>
  );
};

/* ------------------------------------------------------------------ */
/*  Timeline: scenes in order with their length (30 fps)               */
/* ------------------------------------------------------------------ */
export const SCENES: {name: string; motion: string; C: React.FC; dur: number}[] = [
  {name: '0 · Titel', motion: 'Foto popt in, woorden slaan één voor één in beeld', C: TitleScene, dur: 105},
  {name: '1 · Wat is GTM', motion: 'Pijlen schieten van product naar klant', C: GtmScene, dur: 165},
  {name: '2 · Het probleem', motion: 'Inbox loopt in 1 s vol met identieke mails', C: ProblemScene, dur: 195},
  {name: '3 · GTM engineering', motion: 'Groene wipe, tekst slaat hard in', C: WhatScene, dur: 165},
  {name: '4 · Unieke data', motion: 'Doorstrepen → snap-zoom op het doel', C: DataScene, dur: 210},
  {name: '5 · Signalen', motion: 'Elk signaal vult de meter, ding bij 100%', C: SignalsScene, dur: 285},
  {name: '6 · Upsell', motion: 'Signalen poppen op → melding schuift in', C: UpsellScene, dur: 195},
  {name: '7 · Blijven testen', motion: 'Cirkel draait, stappen lichten op', C: TestScene, dur: 165},
  {name: '8 · Zo doet Sowly het', motion: 'Stappen slaan in, tellers lopen op', C: SowlyScene, dur: 150},
  {name: '9 · Afsluiter', motion: 'Foto zoomt in, volg-knop pulseert', C: OutroScene, dur: 150},
];
