import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

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

/* ------------------------------------------------------------------ */
/*  Shared bits                                                        */
/* ------------------------------------------------------------------ */
type Tone = 'paper' | 'ink' | 'sprout' | 'wash';
const BG: Record<Tone, string> = {paper: PAPER, ink: INK, sprout: SPROUT, wash: WASH};
const FG: Record<Tone, string> = {paper: INK, ink: PAPER, sprout: INK, wash: INK};

const Frame: React.FC<{tone: Tone; step: string | null; children: React.ReactNode}> = ({tone, step, children}) => {
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
        style={{
          position: 'absolute',
          top: 52,
          right: X,
          height: 74,
          filter: dark ? 'brightness(0) invert(0.97)' : 'none',
        }}
      />
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

const Seed: React.FC<{children: React.ReactNode; tone: Tone}> = ({children, tone}) => (
  <div
    style={{
      position: 'absolute',
      left: X,
      right: X,
      bottom: 64,
      fontFamily: MONO,
      fontSize: 22,
      letterSpacing: 1,
      color: tone === 'ink' ? WASH : DEEP,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}
  >
    <span style={{fontSize: 26}}>🌱</span>
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Style frames (peak moment of each scene)                           */
/* ------------------------------------------------------------------ */

// 0 — Title
export const TitleFrame: React.FC = () => (
  <Frame tone="ink" step={null}>
    <div style={{position: 'absolute', left: X, right: X, top: 230}}>
      <Img
        src={staticFile('thomas.jpg')}
        style={{width: 150, height: 150, borderRadius: 75, objectFit: 'cover', boxShadow: `0 0 0 5px ${SPROUT}`}}
      />
      <div style={{fontSize: 140, fontWeight: 800, lineHeight: 0.95, letterSpacing: -5, marginTop: 46}}>
        GTM
        <br />
        <span style={{color: SPROUT}}>Engineering</span>
      </div>
      <div style={{fontSize: 40, fontWeight: 700, marginTop: 30, color: WASH}}>uitgelegd in 1 minuut</div>
    </div>
    <Seed tone="ink">Thomas Lock · Sowly.ai</Seed>
  </Frame>
);

// 1 — What is GTM
export const GtmFrame: React.FC = () => {
  const steps = ['Marketing', 'Sales', 'Customer Success'];
  return (
    <Frame tone="paper" step="GO-TO-MARKET">
      <div style={{position: 'absolute', left: X, right: X, top: 200}}>
        <div style={{fontSize: 72, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2}}>
          Alles tussen jouw <span style={{background: WASH, padding: '0 10px', borderRadius: 10}}>product/dienst</span> en
          een betalende klant.
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 70}}>
          <Pill dark>Product/dienst</Pill>
          {steps.map((s) => (
            <React.Fragment key={s}>
              <Arrow />
              <Pill dark={false}>{s}</Pill>
            </React.Fragment>
          ))}
          <Arrow />
          <Pill dark green>Klant</Pill>
        </div>
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

// 2 — The problem: everyone sows the same seed
export const ProblemFrame: React.FC = () => (
  <Frame tone="paper" step="HET PROBLEEM">
    <div style={{position: 'absolute', left: X, right: X, top: 190}}>
      <div style={{fontSize: 70, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2}}>
        Iedereen zoekt klanten op <span style={{color: STOP}}>dezelfde manier.</span>
      </div>
      <div style={{display: 'flex', gap: 10, marginTop: 26}}>
        {['bedrijfsgrootte', 'sector', 'functietitel'].map((c) => (
          <div key={c} style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, padding: '8px 14px', borderRadius: 10, background: STOP_WASH, color: STOP}}>
            {c}
          </div>
        ))}
      </div>
    </div>
    {/* identical inbox */}
    <div style={{position: 'absolute', left: X, right: X, top: 560, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14}}>
      {new Array(9).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            padding: '14px 16px',
            borderRadius: 12,
            background: CARD,
            border: `1px solid ${BORDER}`,
            transform: `rotate(${((i * 37) % 7) - 3}deg)`,
            opacity: 1 - (i % 3) * 0.12,
          }}
        >
          <div style={{fontSize: 19, fontWeight: 800}}>Quick question 👋</div>
          <div style={{height: 8, borderRadius: 4, background: 'rgba(15,42,29,0.1)', marginTop: 10}} />
          <div style={{height: 8, width: '60%', borderRadius: 4, background: 'rgba(15,42,29,0.1)', marginTop: 6}} />
        </div>
      ))}
    </div>
    <Seed tone="paper">Iedereen zaait hetzelfde zaad op hetzelfde veld.</Seed>
  </Frame>
);

// 3 — What is GTM engineering
export const WhatFrame: React.FC = () => (
  <Frame tone="sprout" step="GTM ENGINEERING">
    <div style={{position: 'absolute', left: X, right: X, top: 230}}>
      <div style={{fontSize: 104, fontWeight: 800, lineHeight: 1, letterSpacing: -3.5}}>Niet meer mensen.</div>
      <div
        style={{
          display: 'inline-block',
          marginTop: 18,
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
      <div style={{fontSize: 36, fontWeight: 700, marginTop: 50, lineHeight: 1.3}}>
        Data + AI + automatisering die laten zien
        <br />
        <b>wie</b> je benadert, <b>wanneer</b> en <b>waarom</b>.
      </div>
    </div>
  </Frame>
);

// 4 — Unique data
export const DataFrame: React.FC = () => (
  <Frame tone="ink" step="1 · UNIEKE DATA">
    <div style={{position: 'absolute', left: X, right: X, top: 200}}>
      <div style={{fontSize: 44, fontWeight: 700, color: 'rgba(251,250,245,0.5)', textDecoration: 'line-through', textDecorationColor: STOP}}>
        Alle restaurants in Europa
      </div>
      <div style={{fontSize: 30, color: SPROUT, margin: '18px 0', fontWeight: 800}}>↓ inzoomen</div>
      <div style={{position: 'relative', display: 'inline-block'}}>
        <div style={{fontSize: 74, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2}}>
          Berlijnse cafés die <span style={{color: SPROUT}}>net zijn begonnen met bezorgen</span>
        </div>
        {/* crosshair corners */}
        {[
          {left: -20, top: -20, bl: true, bt: true},
          {right: -20, top: -20, br: true, bt: true},
          {left: -20, bottom: -20, bl: true, bb: true},
          {right: -20, bottom: -20, br: true, bb: true},
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
              borderLeft: c.bl ? `5px solid ${SPROUT}` : undefined,
              borderRight: c.br ? `5px solid ${SPROUT}` : undefined,
              borderTop: c.bt ? `5px solid ${SPROUT}` : undefined,
              borderBottom: c.bb ? `5px solid ${SPROUT}` : undefined,
            }}
          />
        ))}
      </div>
      <div style={{fontSize: 30, color: WASH, marginTop: 50, lineHeight: 1.35}}>
        Kijk naar je beste klanten: wat hebben zij gemeen dat concurrenten niet zien?
      </div>
    </div>
    <Seed tone="ink">Weten welke grond vruchtbaar is.</Seed>
  </Frame>
);

// 5 — Signals that add up
export const SignalsFrame: React.FC = () => {
  const signals = ['Past bij je ideale klant', 'Net geld opgehaald', 'Vacature voor salesmensen', 'Bekijkt je prijzenpagina'];
  return (
    <Frame tone="paper" step="2 · SIGNALEN DIE OPTELLEN">
      <div style={{position: 'absolute', left: X, right: X, top: 180}}>
        <div style={{fontSize: 64, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2}}>
          Eén signaal is geen reden. <span style={{background: WASH, padding: '0 10px', borderRadius: 10}}>Samen wel.</span>
        </div>
        <div style={{display: 'flex', gap: 34, marginTop: 50, alignItems: 'flex-end'}}>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 12}}>
            {signals.map((s) => (
              <div
                key={s}
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
            ))}
          </div>
          {/* meter */}
          <div style={{width: 230, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{fontFamily: MONO, fontSize: 18, fontWeight: 800, color: DEEP, textAlign: 'center', marginBottom: 12}}>
              REDEN VOOR
              <br />
              OUTREACH ✓
            </div>
            <div style={{width: 90, height: 330, borderRadius: 45, background: 'rgba(15,42,29,0.08)', position: 'relative', overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: '100%', background: `linear-gradient(0deg, ${WASH}, ${SPROUT})`}} />
              {[1, 2, 3].map((k) => (
                <div key={k} style={{position: 'absolute', left: 0, right: 0, bottom: `${k * 25}%`, height: 3, background: PAPER}} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Seed tone="paper">Zaaien als het weer goed is.</Seed>
    </Frame>
  );
};

// 6 — Upsell
export const UpsellFrame: React.FC = () => (
  <Frame tone="wash" step="3 · GROEIEN BIJ KLANTEN">
    <div style={{position: 'absolute', left: X, right: X, top: 190}}>
      <div style={{fontSize: 66, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2}}>
        Je beste nieuwe omzet zit vaak al <span style={{background: INK, color: SPROUT, padding: '0 12px', borderRadius: 10}}>in je klantenbestand.</span>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 50}}>
        {['Vraagt naar een functie uit je duurdere pakket', 'Team groeit hard: +40% gebruikers'].map((s) => (
          <div key={s} style={{padding: '18px 22px', borderRadius: 16, background: CARD, fontSize: 28, fontWeight: 750, display: 'flex', gap: 14}}>
            <span style={{color: SPROUT}}>●</span>
            {s}
          </div>
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
          }}
        >
          🔔 Accountmanager: <span style={{color: SPROUT}}>tijd voor een upsell-gesprek</span>
        </div>
      </div>
    </div>
    <Seed tone="wash">Oogsten bij wat al groeit.</Seed>
  </Frame>
);

// 7 — Keep testing
export const TestFrame: React.FC = () => {
  const loop = ['Idee', 'Testen', 'Leren', 'Opschalen'];
  const R = 190;
  return (
    <Frame tone="ink" step="4 · BLIJVEN TESTEN">
      <div style={{position: 'absolute', left: X, right: X, top: 180, fontSize: 64, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2}}>
        Geen aanpak werkt <span style={{color: SPROUT}}>voor altijd.</span>
      </div>
      <div style={{position: 'absolute', left: 540 - R - 70, top: 400, width: 2 * R + 140, height: 2 * R + 140}}>
        <svg width={2 * R + 140} height={2 * R + 140} style={{position: 'absolute', inset: 0}}>
          <circle cx={R + 70} cy={R + 70} r={R} fill="none" stroke={SPROUT} strokeWidth={5} strokeDasharray="18 14" opacity={0.7} />
        </svg>
        {loop.map((l, i) => {
          const a = (i / loop.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <div
              key={l}
              style={{
                position: 'absolute',
                left: R + 70 + Math.cos(a) * R,
                top: R + 70 + Math.sin(a) * R,
                transform: 'translate(-50%, -50%)',
                padding: '14px 22px',
                borderRadius: 14,
                background: i === 3 ? SPROUT : PAPER,
                color: INK,
                fontSize: 30,
                fontWeight: 800,
              }}
            >
              {l}
            </div>
          );
        })}
      </div>
      <Seed tone="ink">Proefveldjes: wat groeit, zaai je breder.</Seed>
    </Frame>
  );
};

// 9 — Outro
export const OutroFrame: React.FC = () => (
  <Frame tone="paper" step={null}>
    <div style={{position: 'absolute', left: X, right: X, top: 230, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
      <Img
        src={staticFile('thomas.jpg')}
        style={{width: 210, height: 210, borderRadius: 105, objectFit: 'cover', boxShadow: `0 0 0 6px ${SPROUT}, 0 20px 40px rgba(15,42,29,0.2)`}}
      />
      <div style={{fontSize: 76, fontWeight: 800, letterSpacing: -2, marginTop: 40}}>Thomas Lock</div>
      <div style={{fontSize: 30, color: DEEP, fontWeight: 700, marginTop: 8}}>GTM & RevOps architect · Founder Sowly.ai</div>
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
        <span style={{background: SPROUT, color: INK, padding: '10px 18px', borderRadius: 12, fontSize: 28}}>+ Volgen</span>
      </div>
    </div>
  </Frame>
);

export const STYLE_FRAMES: {name: string; motion: string; C: React.FC}[] = [
  {name: '0 · Titel', motion: 'Foto popt in, woorden slaan één voor één in beeld', C: TitleFrame},
  {name: '1 · Wat is GTM', motion: 'Pijlen schieten van product naar klant', C: GtmFrame},
  {name: '2 · Het probleem', motion: 'Inbox loopt in 1 s vol met identieke mails', C: ProblemFrame},
  {name: '3 · GTM engineering', motion: 'Groene wipe, tekst slaat hard in', C: WhatFrame},
  {name: '4 · Unieke data', motion: 'Doorstrepen → snap-zoom op het doel', C: DataFrame},
  {name: '5 · Signalen', motion: 'Elk signaal vult de meter, ding bij 100%', C: SignalsFrame},
  {name: '6 · Upsell', motion: 'Signalen poppen op → melding schuift in', C: UpsellFrame},
  {name: '7 · Blijven testen', motion: 'Cirkel draait, stappen lichten op', C: TestFrame},
  {name: '9 · Afsluiter', motion: 'Foto zoomt in, volg-knop pulseert', C: OutroFrame},
];
