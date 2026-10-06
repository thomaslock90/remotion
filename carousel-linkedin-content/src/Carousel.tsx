import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';

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

const X = 88;

const SLIDES: React.FC[] = [Cover, Temperature, Proof, Receipts, Machine, Without, Share, Pipeline, Closing, About];
export const SLIDE_COUNT = SLIDES.length;

export const Carousel: React.FC = () => {
  const i = useCurrentFrame();
  const Slide = SLIDES[i];
  const dark = Slide === Closing;
  return (
    <AbsoluteFill style={{backgroundColor: dark ? INK : PAPER, fontFamily: SANS, color: dark ? PAPER : INK}}>
      {dark ? (
        <AbsoluteFill
          style={{background: 'radial-gradient(90% 60% at 80% 0%, rgba(116,189,31,0.22), transparent 60%)'}}
        />
      ) : (
        <>
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
        </>
      )}

      {/* Chrome: logo, page counter, footer */}
      <Img
        src={staticFile('sowly-logo.png')}
        style={{
          position: 'absolute',
          top: 64,
          left: X,
          height: 70,
          filter: dark ? 'brightness(0) invert(0.96) sepia(0.15)' : 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 88,
          right: X,
          fontFamily: MONO,
          fontSize: 20,
          letterSpacing: 3,
          color: dark ? WASH : FAINT,
        }}
      >
        {String(i + 1).padStart(2, '0')} / {String(SLIDE_COUNT).padStart(2, '0')}
      </div>
      <div
        style={{
          position: 'absolute',
          left: X,
          right: X,
          bottom: 64,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: MONO,
          fontSize: 19,
          letterSpacing: 1,
          color: dark ? WASH : FAINT,
        }}
      >
        <span>Thomas Lock · GTM & RevOps architect</span>
        {i < SLIDE_COUNT - 1 ? (
          <span style={{color: dark ? SPROUT : DEEP, fontWeight: 700}}>Swipe →</span>
        ) : null}
      </div>

      <AbsoluteFill style={{padding: `200px ${X}px 150px`}}>
        <Slide />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/*  Shared bits                                                        */
/* ------------------------------------------------------------------ */
const Eyebrow: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = DEEP}) => (
  <div
    style={{
      fontFamily: MONO,
      fontSize: 20,
      letterSpacing: 5,
      color,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginBottom: 22,
    }}
  >
    <span style={{width: 34, height: 2, background: color === DEEP ? SPROUT : color}} />
    {children}
  </div>
);

const H: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 74}) => (
  <div style={{fontSize: size, fontWeight: 800, lineHeight: 1.06, letterSpacing: -size * 0.026}}>{children}</div>
);

const Mark: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{background: WASH, color: INK, padding: '0 12px', borderRadius: 10, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>
    {children}
  </span>
);

const Lead: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontSize: 33, lineHeight: 1.4, color: DEEP, marginTop: 32}}>{children}</div>
);

/* ------------------------------------------------------------------ */
/*  01 — Cover                                                         */
/* ------------------------------------------------------------------ */
function Cover() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <Eyebrow>OUTBOUND × CONTENT</Eyebrow>
      <H size={84}>
        Koud benaderd worden door een onbekende voelt direct als spam.
      </H>
      <div style={{height: 40}} />
      <H size={84}>
        <Mark>Tenzij</Mark> ze je al 3 of 4 keer in hun feed zagen.
      </H>
      <div style={{flex: 1}} />
      <FeedStack />
    </div>
  );
}

const FeedStack: React.FC = () => (
  <div style={{display: 'flex', gap: 16, alignItems: 'flex-end'}}>
    {[0, 1, 2, 3].map((n) => (
      <div
        key={n}
        style={{
          flex: 1,
          height: 120 + n * 26,
          borderRadius: 16,
          background: CARD,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 10px 26px rgba(15,42,29,0.06)',
          padding: 18,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <div style={{width: 30, height: 30, borderRadius: 15, background: n === 3 ? SPROUT : WASH}} />
          <div style={{fontFamily: MONO, fontSize: 15, color: DEEP, fontWeight: 700}}>post {n + 1}</div>
        </div>
        <div style={{height: 9, borderRadius: 5, background: 'rgba(15,42,29,0.08)'}} />
        <div style={{height: 9, width: '70%', borderRadius: 5, background: 'rgba(15,42,29,0.08)'}} />
      </div>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/*  02 — How cold is your message?                                     */
/* ------------------------------------------------------------------ */
function Temperature() {
  const steps = [
    {n: '0×', label: 'onbekend'},
    {n: '1×', label: ''},
    {n: '2×', label: ''},
    {n: '3×', label: ''},
    {n: '4×', label: 'herkend'},
  ];
  const ramp = ['#E4E2DA', '#D4E8B4', '#B5DD7A', '#8ECF33', '#74BD1F'];
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <Eyebrow>HOE KOUD IS JE BERICHT?</Eyebrow>
      <H>
        Hoe vaker ze je zagen, hoe <Mark>minder koud</Mark> je bericht.
      </H>

      <div
        style={{
          marginTop: 'auto',
          padding: '40px 36px 36px',
          borderRadius: 24,
          background: CARD,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 12px 32px rgba(15,42,29,0.06)',
        }}
      >
        <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: 2, color: FAINT, marginBottom: 26}}>
          KEER IN JE FEED GEZIEN VÓÓR HET EERSTE BERICHT
        </div>
        <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between'}}>
          <div
            style={{
              position: 'absolute',
              left: 44,
              right: 44,
              top: 42,
              height: 8,
              borderRadius: 4,
              background: `linear-gradient(90deg, ${ramp.join(',')})`,
            }}
          />
          {steps.map((s, i) => (
            <div key={s.n} style={{width: 88, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1}}>
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 44,
                  background: ramp[i],
                  border: `4px solid ${CARD}`,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: MONO,
                  fontWeight: 800,
                  fontSize: 26,
                  color: INK,
                }}
              >
                {s.n}
              </div>
              <div style={{fontFamily: MONO, fontSize: 17, color: DEEP, marginTop: 12, height: 22}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display: 'flex', gap: 24, marginTop: 40, marginBottom: 'auto'}}>
        <Quote tone="cold" title="Onbekende in je inbox" body="Voelt meteen als spam." />
        <Quote tone="warm" title="3 à 4 keer voorbij zien komen" body="Een stuk minder koud." />
      </div>
    </div>
  );
}

const Quote: React.FC<{tone: 'cold' | 'warm'; title: string; body: string}> = ({tone, title, body}) => (
  <div
    style={{
      flex: 1,
      padding: '34px 32px',
      borderRadius: 20,
      background: tone === 'cold' ? STOP_WASH : INK,
      color: tone === 'cold' ? STOP : PAPER,
      border: tone === 'cold' ? `1px solid ${STOP}44` : 'none',
    }}
  >
    <div style={{fontSize: 34, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.15}}>{tone === 'cold' ? '✕ ' : '✓ '}{title}</div>
    <div style={{fontSize: 28, marginTop: 12, color: tone === 'cold' ? STOP : WASH}}>{body}</div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  03 — Proof from client campaign data                               */
/* ------------------------------------------------------------------ */
const METRICS = [
  {label: 'Connectieverzoeken geaccepteerd', weekly: 41.8, none: 30.5},
  {label: 'Reacties op berichten', weekly: 22.2, none: 14.2},
];
const pct = (n: number) => `${n.toFixed(1).replace('.', ',')}%`;

function Proof() {
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <Eyebrow>UIT DE CAMPAGNECIJFERS</Eyebrow>
      <H>
        Zelfde team. Zelfde campagne. <Mark>Eén verschil.</Mark>
      </H>
      <Lead>Twee mensen uit hetzelfde team draaiden dezelfde outbound-campagne. De een post wekelijks op LinkedIn, de ander niet.</Lead>

      <div style={{marginTop: 'auto', marginBottom: 'auto', display: 'flex', flexDirection: 'column', gap: 20}}>
        <div style={{display: 'flex', gap: 26, fontSize: 22, fontWeight: 700}}>
          <span style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <span style={{width: 18, height: 18, borderRadius: 5, background: SPROUT}} /> Post wekelijks
          </span>
          <span style={{display: 'flex', alignItems: 'center', gap: 10, color: FAINT}}>
            <span style={{width: 18, height: 18, borderRadius: 5, background: '#D9D7CE'}} /> Post niet
          </span>
        </div>
        {METRICS.map((m) => {
          const lift = Math.round((m.weekly / m.none - 1) * 100);
          return (
            <div
              key={m.label}
              style={{
                padding: '26px 30px 28px',
                borderRadius: 22,
                background: CARD,
                border: `1px solid ${BORDER}`,
                boxShadow: '0 12px 32px rgba(15,42,29,0.06)',
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <div style={{fontSize: 30, fontWeight: 800, letterSpacing: -0.4}}>{m.label}</div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 20,
                    fontWeight: 800,
                    color: INK,
                    background: WASH,
                    padding: '6px 12px',
                    borderRadius: 8,
                  }}
                >
                  +{lift}%
                </div>
              </div>
              {[
                {v: m.weekly, c: SPROUT, t: INK},
                {v: m.none, c: '#D9D7CE', t: FAINT},
              ].map((b, k) => (
                <div key={k} style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: k === 0 ? 20 : 12}}>
                  <div style={{flex: 1, height: 44, borderRadius: 10, background: 'rgba(15,42,29,0.05)', overflow: 'hidden'}}>
                    <div style={{width: `${(b.v / 50) * 100}%`, height: '100%', borderRadius: 10, background: b.c}} />
                  </div>
                  <div style={{width: 120, textAlign: 'right', fontSize: 36, fontWeight: 800, color: b.t, letterSpacing: -0.8}}>
                    {pct(b.v)}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
        <div style={{fontFamily: MONO, fontSize: 18, color: DEEP, letterSpacing: 0.5}}>
          Zelfde bedrijf · zelfde aanbod · zelfde campagne
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  04 — The raw dashboard screenshots                                 */
/* ------------------------------------------------------------------ */
const SHOTS = [
  {
    src: 'proof-weekly.png',
    label: 'POST WEKELIJKS',
    accent: SPROUT,
    // Highlight boxes (in % of the screenshot): replied rate, invitations accepted
    marks: [
      {l: 67.2, t: 16, w: 31.6, h: 36},
      {l: 1.4, t: 58, w: 31, h: 36},
    ],
  },
  {
    src: 'proof-none.png',
    label: 'POST NIET',
    accent: '#B9B6AA',
    marks: [
      {l: 66.6, t: 16, w: 31.8, h: 40},
      {l: 1.4, t: 59, w: 31.6, h: 38},
    ],
  },
];

function Receipts() {
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <Eyebrow>DE RUWE CIJFERS</Eyebrow>
      <H size={64}>Rechtstreeks uit het campagnedashboard.</H>
      <div style={{marginTop: 'auto', marginBottom: 'auto', display: 'flex', flexDirection: 'column', gap: 24}}>
        {SHOTS.map((sh) => (
          <div
            key={sh.src}
            style={{
              padding: '20px 24px 24px',
              borderRadius: 22,
              background: CARD,
              border: `1px solid ${BORDER}`,
              boxShadow: '0 12px 32px rgba(15,42,29,0.06)',
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
              <span style={{width: 16, height: 16, borderRadius: 5, background: sh.accent}} />
              <span style={{fontFamily: MONO, fontSize: 19, fontWeight: 800, letterSpacing: 2.5, color: INK}}>{sh.label}</span>
            </div>
            <div style={{position: 'relative'}}>
              <Img src={staticFile(sh.src)} style={{width: '100%', display: 'block', borderRadius: 10}} />
              {sh.marks.map((m, k) => (
                <div
                  key={k}
                  style={{
                    position: 'absolute',
                    left: `${m.l}%`,
                    top: `${m.t}%`,
                    width: `${m.w}%`,
                    height: `${m.h}%`,
                    borderRadius: 12,
                    boxShadow: `0 0 0 4px ${SPROUT}`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
        <div style={{fontFamily: MONO, fontSize: 18, color: DEEP, letterSpacing: 0.5}}>
          Bron: outbound-campagne van een klant
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  03 — Content is the front of the sales machine                    */
/* ------------------------------------------------------------------ */
function Machine() {
  const outs = [
    {t: 'Outbound', s: 'je naam is al bekend'},
    {t: 'Inbound', s: 'leads komen naar jou'},
    {t: 'Salesgesprek', s: 'vertrouwen is er al'},
  ];
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <Eyebrow>GEEN PERSONAL BRANDING</Eyebrow>
      <H>
        Content is de <Mark>voorkant</Mark> van je salesmachine.
      </H>
      <Lead>Toch zien veel mensen posten op LinkedIn nog als iets voor personal branding.</Lead>

      <div style={{marginTop: 'auto', marginBottom: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '34px 34px',
            borderRadius: 22,
            background: INK,
            color: PAPER,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{fontSize: 36, fontWeight: 800}}>Content</div>
          <div style={{fontFamily: MONO, fontSize: 19, color: WASH}}>vast ritme · elke week</div>
        </div>
        <svg width={904} height={90} style={{display: 'block'}}>
          {[150, 452, 754].map((x) => (
            <path key={x} d={`M452,0 C452,50 ${x},40 ${x},90`} stroke={SPROUT} strokeWidth={3} fill="none" />
          ))}
        </svg>
        <div style={{display: 'flex', gap: 22, width: '100%'}}>
          {outs.map((o) => (
            <div
              key={o.t}
              style={{
                flex: 1,
                padding: '30px 24px',
                borderRadius: 18,
                background: CARD,
                border: `1px solid ${BORDER}`,
                boxShadow: '0 10px 26px rgba(15,42,29,0.06)',
              }}
            >
              <div style={{fontSize: 31, fontWeight: 800, letterSpacing: -0.4}}>{o.t}</div>
              <div style={{fontSize: 24, color: DEEP, marginTop: 8, lineHeight: 1.3}}>{o.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  04 — Without recognition                                           */
/* ------------------------------------------------------------------ */
function Without() {
  const rows = [
    {t: 'Je bent de zoveelste onbekende', s: 'in de inbox van je prospect'},
    {t: 'Je outbound krijgt minder reacties', s: 'zoals de campagnecijfers laten zien'},
    {t: 'Je legt vooral uit wie je bent', s: 'en wat je nu eigenlijk doet, in elk salesgesprek'},
  ];
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <Eyebrow color={STOP}>ZONDER HERKENBAARHEID</Eyebrow>
      <H>Zonder herkenbaarheid begin je elke keer bij nul.</H>
      <div style={{marginTop: 'auto', marginBottom: 'auto', display: 'flex', flexDirection: 'column', gap: 26}}>
        {rows.map((r) => (
          <div
            key={r.t}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              padding: '40px 34px',
              borderRadius: 20,
              background: CARD,
              border: `1px solid ${BORDER}`,
              boxShadow: '0 10px 26px rgba(15,42,29,0.05)',
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                flexShrink: 0,
                borderRadius: 16,
                background: STOP_WASH,
                color: STOP,
                fontSize: 30,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </div>
            <div>
              <div style={{fontSize: 36, fontWeight: 800, letterSpacing: -0.5}}>{r.t}</div>
              <div style={{fontSize: 27, color: DEEP, marginTop: 8}}>{r.s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  05 — Share how you solve problems                                  */
/* ------------------------------------------------------------------ */
function Share() {
  const posts = [
    'Hoe je de problemen van je doelgroep oplost',
    'Hoe je naar de markt kijkt',
    'Waar jij expert in bent',
  ];
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <Eyebrow>DUS DEEL MEER</Eyebrow>
      <H>
        Bouw <Mark>vertrouwen</Mark> op vóór het eerste gesprek.
      </H>
      <Lead>Ook bij mensen die je nog nooit hebt gesproken.</Lead>

      <div style={{marginTop: 'auto', marginBottom: 'auto', display: 'flex', alignItems: 'stretch', gap: 18}}>
        <div style={{flex: 1.25, display: 'flex', flexDirection: 'column', gap: 16}}>
          {posts.map((p, i) => (
            <div
              key={p}
              style={{
                padding: '24px 26px',
                borderRadius: 18,
                background: CARD,
                border: `1px solid ${BORDER}`,
                boxShadow: '0 10px 26px rgba(15,42,29,0.06)',
              }}
            >
              <div style={{fontFamily: MONO, fontSize: 17, color: DEEP, fontWeight: 700}}>DEEL {i + 1}</div>
              <div style={{fontSize: 30, fontWeight: 800, marginTop: 8, letterSpacing: -0.4, lineHeight: 1.15}}>{p}</div>
            </div>
          ))}
        </div>
        <div style={{display: 'flex', alignItems: 'center', fontSize: 44, color: SPROUT, fontWeight: 800}}>→</div>
        <div
          style={{
            flex: 1,
            padding: '28px 28px',
            borderRadius: 18,
            background: INK,
            color: PAPER,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{fontFamily: MONO, fontSize: 17, color: WASH, fontWeight: 700}}>RESULTAAT</div>
          <div style={{fontSize: 36, fontWeight: 800, marginTop: 12, lineHeight: 1.15}}>
            Een bekend gezicht vóór je eerste bericht
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  06 — Less resistance across the pipeline                           */
/* ------------------------------------------------------------------ */
function Pipeline() {
  const rows = [
    {t: 'Outbound', s: 'krijgt sneller een reactie'},
    {t: 'Inbound', s: 'leads weten al wie je bent voordat ze contact opnemen'},
    {t: 'Salesgesprek', s: 'kan meteen over het probleem van je prospect gaan'},
  ];
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <Eyebrow>HET EFFECT</Eyebrow>
      <H>
        En dat ga je merken in je <Mark>pipeline</Mark>.
      </H>
      <Lead>Herkenbaarheid haalt de weerstand weg.</Lead>
      <div style={{position: 'relative', marginTop: 'auto', marginBottom: 'auto'}}>
        <div style={{position: 'absolute', left: 31, top: 40, bottom: 40, width: 3, background: SPROUT, opacity: 0.6}} />
        {rows.map((r) => (
          <div key={r.t} style={{display: 'flex', alignItems: 'center', gap: 26, marginBottom: 28, position: 'relative'}}>
            <div
              style={{
                width: 64,
                height: 64,
                flexShrink: 0,
                borderRadius: 32,
                background: SPROUT,
                color: INK,
                fontSize: 30,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 0 8px ${PAPER}`,
              }}
            >
              ✓
            </div>
            <div
              style={{
                flex: 1,
                padding: '32px 30px',
                borderRadius: 20,
                background: CARD,
                border: `1px solid ${BORDER}`,
                boxShadow: '0 10px 26px rgba(15,42,29,0.05)',
              }}
            >
              <div style={{fontSize: 38, fontWeight: 800, letterSpacing: -0.5}}>{r.t}</div>
              <div style={{fontSize: 27, color: DEEP, marginTop: 8, lineHeight: 1.3}}>{r.s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  07 — Closing statement (dark)                                      */
/* ------------------------------------------------------------------ */
function Closing() {
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <Eyebrow color={WASH}>TOT SLOT</Eyebrow>
      <div style={{fontSize: 88, fontWeight: 800, lineHeight: 1.06, letterSpacing: -2.2}}>
        Dan is je eerste bericht niet meer je <span style={{color: SPROUT}}>eerste contact.</span>
      </div>
      <div
        style={{
          marginTop: 80,
          padding: '34px 36px',
          borderRadius: 22,
          border: '2px solid rgba(200,232,154,0.35)',
          background: 'rgba(200,232,154,0.08)',
        }}
      >
        <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: 3, color: SPROUT}}>VRAAG AAN JOU</div>
        <div style={{fontSize: 38, fontWeight: 700, lineHeight: 1.25, marginTop: 12, color: PAPER}}>
          Hoe vaak heeft een prospect jou al gezien voordat jij een bericht stuurt?
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  08 — About Thomas Lock                                             */
/* ------------------------------------------------------------------ */
function About() {
  const outcomes = [
    {t: 'Je volledige markt en beslissers in kaart', s: 'per segment'},
    {t: 'Signalen die laten zien wie vandaag op zoek is', s: 'naar jouw product of dienst'},
    {t: 'Een CRM dat klopt', s: 'en een salesfunnel die voorspelbaar pipeline oplevert'},
  ];
  const stats = [
    {n: '10+', l: 'B2B-bedrijven'},
    {n: '400+', l: 'gekwalificeerde salesgesprekken'},
    {n: '€6M+', l: 'pipeline'},
  ];
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <Eyebrow>OVER MIJ</Eyebrow>
      <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
        <Img
          src={staticFile('thomas.jpg')}
          style={{
            width: 132,
            height: 132,
            borderRadius: 66,
            objectFit: 'cover',
            border: `5px solid ${CARD}`,
            boxShadow: `0 0 0 3px ${SPROUT}, 0 14px 30px rgba(15,42,29,0.18)`,
          }}
        />
        <div>
          <div style={{fontSize: 56, fontWeight: 800, letterSpacing: -1.4}}>Thomas Lock</div>
          <div style={{fontSize: 26, color: DEEP, marginTop: 6, fontWeight: 600}}>
            GTM & RevOps architect · Founder Sowly.ai
          </div>
        </div>
      </div>

      <div style={{fontSize: 36, lineHeight: 1.28, marginTop: 34, fontWeight: 700, letterSpacing: -0.5}}>
        Ik bouw de salesmachine van <Mark>B2B Tech-, SaaS- en servicebedrijven</Mark>.
      </div>

      <div style={{fontFamily: MONO, fontSize: 17, letterSpacing: 3, color: DEEP, marginTop: 30}}>WAT JE KRIJGT</div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14}}>
        {outcomes.map((o) => (
          <div
            key={o.t}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '11px 20px',
              borderRadius: 14,
              background: CARD,
              border: `1px solid ${BORDER}`,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                flexShrink: 0,
                borderRadius: 10,
                background: SPROUT,
                color: INK,
                fontSize: 20,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✓
            </div>
            <div>
              <div style={{fontSize: 25, fontWeight: 750, letterSpacing: -0.3}}>{o.t}</div>
              <div style={{fontSize: 19, color: DEEP, marginTop: 2}}>{o.s}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{fontFamily: MONO, fontSize: 17, letterSpacing: 3, color: DEEP, marginTop: 26}}>→ DAT LEVERT OP</div>
      <div style={{display: 'flex', gap: 16, marginTop: 14}}>
        {stats.map((s) => (
          <div
            key={s.n}
            style={{
              flex: 1,
              padding: '14px 22px 16px',
              borderRadius: 16,
              background: WASH,
            }}
          >
            <div style={{fontSize: 46, fontWeight: 800, letterSpacing: -1.2, color: INK}}>{s.n}</div>
            <div style={{fontSize: 20, color: DEEP, marginTop: 4, lineHeight: 1.25, fontWeight: 600}}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{flex: 1, minHeight: 28}} />

      <div
        style={{
          padding: '22px 30px',
          borderRadius: 22,
          background: INK,
          color: PAPER,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <div>
          <div style={{fontSize: 32, fontWeight: 800, letterSpacing: -0.5}}>Volg mij voor meer</div>
          <div style={{fontSize: 32, fontWeight: 800, letterSpacing: -0.5, color: SPROUT}}>GTM- en RevOps-plays</div>
        </div>
        <div
          style={{
            padding: '16px 24px',
            borderRadius: 14,
            background: SPROUT,
            color: INK,
            fontSize: 25,
            fontWeight: 800,
            whiteSpace: 'nowrap',
          }}
        >
          + Volgen
        </div>
      </div>
    </div>
  );
}
