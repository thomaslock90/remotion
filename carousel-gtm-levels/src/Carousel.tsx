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

const SANS =
  '"Helvetica Neue", Helvetica, "Liberation Sans", "DejaVu Sans", Arial, sans-serif';
const MONO =
  '"SF Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace';

const X = 80;

/* ------------------------------------------------------------------ */
/*  Content: photo slides in story order                               */
/* ------------------------------------------------------------------ */
type Photo = {
  src: string;
  pos: string;
  level: 1 | 2 | 3;
  years: string;
  title: string;
  text: string;
  chips: string[];
  textAt: 'top' | 'bottom';
};

const PHOTOS: Photo[] = [
  {
    src: 'l1-knaek.jpg',
    pos: '50% 35%',
    level: 1,
    years: '2013 – 2018',
    title: 'Handmatig ploeteren',
    text: 'Bij Knaek had ik geen CRM. Ik liep langs bedrijven, mijn telefoon was de database en ’s avonds tikte ik alles over in Excel.',
    chips: ['Nul overzicht', 'Nul schaalbaarheid'],
    textAt: 'bottom',
  },
  {
    src: 'l2-flipchart.jpg',
    pos: '50% 25%',
    level: 2,
    years: '2018 – 2023',
    title: 'De wirwar aan tools',
    text: 'Bij Jopp knutselde ik zelf een CRM in elkaar in Airtable, gekoppeld aan Zapier, Typeform en Mailchimp.',
    chips: ['Airtable', 'Zapier', 'Typeform', 'Mailchimp'],
    textAt: 'bottom',
  },
  {
    src: 'l2-jopp-site.jpg',
    pos: '50% 28%',
    level: 2,
    years: '2018 – 2023',
    title: 'Sneller, maar kwetsbaar',
    text: 'Daarna HubSpot en Pipedrive met Lemlist en Apollo, en in 2023 Clay. Eén haperende webhook en het hele proces lag plat.',
    chips: ['HubSpot', 'Pipedrive', 'Lemlist', 'Apollo', 'Clay'],
    textAt: 'bottom',
  },
  {
    src: 'l3-clay.jpg',
    pos: '30% 30%',
    level: 3,
    years: 'Nu bij Sowly',
    title: 'De volwassen AI GTM stack',
    text: 'Outbound draait om precisie in plaats van bulk-spam. Clay geeft realtime inzicht in elke stap.',
    chips: ['Clay', 'Claude Code', 'Codex'],
    textAt: 'bottom',
  },
  {
    src: 'l3-toast.jpg',
    pos: '50% 100%',
    level: 3,
    years: 'Nu bij Sowly',
    title: 'Overdraagbaar, niet afhankelijk',
    text: 'Claude Code en Codex leggen alle logica en documentatie vast. Reps en sales leaders snappen direct hoe het systeem werkt.',
    chips: ['>400 salesgesprekken', '>€6M pipeline'],
    textAt: 'top',
  },
];

type Slide = {kind: 'cover'} | {kind: 'photo'; photo: Photo} | {kind: 'closing'};
const SLIDES: Slide[] = [
  {kind: 'cover'},
  ...PHOTOS.map((photo) => ({kind: 'photo' as const, photo})),
  {kind: 'closing'},
];
export const SLIDE_COUNT = SLIDES.length;

/* ------------------------------------------------------------------ */

export const Carousel: React.FC = () => {
  const i = useCurrentFrame();
  const slide = SLIDES[i];
  const onDark = slide.kind !== 'cover';
  const counter = `${String(i + 1).padStart(2, '0')} / ${String(SLIDE_COUNT).padStart(2, '0')}`;

  return (
    <AbsoluteFill style={{backgroundColor: slide.kind === 'cover' ? PAPER : INK, fontFamily: SANS}}>
      {slide.kind === 'cover' ? <Cover /> : null}
      {slide.kind === 'photo' ? <PhotoSlide photo={slide.photo} /> : null}
      {slide.kind === 'closing' ? <Closing /> : null}

      {/* Chrome */}
      <Img
        src={staticFile('sowly-logo.png')}
        style={{
          position: 'absolute',
          top: 60,
          left: X,
          height: 70,
          filter: onDark ? 'brightness(0) invert(0.97)' : 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 86,
          right: X,
          fontFamily: MONO,
          fontSize: 20,
          letterSpacing: 3,
          color: onDark ? 'rgba(251,250,245,0.85)' : FAINT,
        }}
      >
        {counter}
      </div>
      <div
        style={{
          position: 'absolute',
          left: X,
          right: X,
          bottom: 56,
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: MONO,
          fontSize: 19,
          letterSpacing: 1,
          color: onDark ? 'rgba(200,232,154,0.85)' : FAINT,
        }}
      >
        <span>Thomas Lock · GTM & RevOps architect</span>
        {i < SLIDE_COUNT - 1 ? <span style={{color: onDark ? SPROUT : DEEP, fontWeight: 700}}>Swipe →</span> : null}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/*  Shared                                                             */
/* ------------------------------------------------------------------ */
const Mark: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{background: WASH, color: INK, padding: '0 12px', borderRadius: 10, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>
    {children}
  </span>
);

const LevelMeter: React.FC<{level: number; dark: boolean}> = ({level, dark}) => (
  <div style={{display: 'flex', gap: 8}}>
    {[1, 2, 3].map((n) => (
      <div
        key={n}
        style={{
          width: 54,
          height: 8,
          borderRadius: 4,
          background: n <= level ? SPROUT : dark ? 'rgba(251,250,245,0.25)' : 'rgba(15,42,29,0.12)',
        }}
      />
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Cover                                                              */
/* ------------------------------------------------------------------ */
const Cover: React.FC = () => {
  const tiles = [
    {src: 'l1-knaek.jpg', pos: '50% 40%', level: 1, label: 'Handmatig'},
    {src: 'l2-flipchart.jpg', pos: '50% 20%', level: 2, label: 'Wirwar aan tools'},
    {src: 'l3-clay.jpg', pos: '25% 25%', level: 3, label: 'AI GTM stack'},
  ];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(120% 50% at 50% -6%, rgba(200,232,154,0.4), transparent 60%)'}} />
      <div style={{position: 'absolute', top: 196, left: X, right: X, color: INK}}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 20,
            letterSpacing: 5,
            color: DEEP,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 22,
          }}
        >
          <span style={{width: 34, height: 2, background: SPROUT}} />
          10 JAAR · 3 LEVELS
        </div>
        <div style={{fontSize: 74, fontWeight: 800, lineHeight: 1.06, letterSpacing: -1.9}}>
          Van analoge inschrijfformulieren naar een volwassen <Mark>AI GTM stack</Mark>.
        </div>
        <div style={{fontSize: 30, color: DEEP, marginTop: 24, lineHeight: 1.35}}>
          Mijn weg hiernaartoe was pure chaos. Met vallen en opstaan, in drie levels.
        </div>

        <div style={{display: 'flex', gap: 16, marginTop: 50}}>
          {tiles.map((t) => (
            <div key={t.src} style={{flex: 1}}>
              <div style={{position: 'relative', height: 300, borderRadius: 18, overflow: 'hidden', boxShadow: '0 14px 30px rgba(15,42,29,0.16)'}}>
                <Img src={staticFile(t.src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: t.pos}} />
                <div
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: 12,
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: SPROUT,
                    color: INK,
                    fontFamily: MONO,
                    fontSize: 16,
                    fontWeight: 800,
                    letterSpacing: 1.5,
                  }}
                >
                  LEVEL {t.level}
                </div>
              </div>
              <div style={{fontSize: 23, fontWeight: 750, marginTop: 12}}>{t.label}</div>
            </div>
          ))}
        </div>

        <div style={{display: 'flex', gap: 16, marginTop: 36}}>
          {[
            {n: '>400', l: 'gekwalificeerde salesgesprekken'},
            {n: '>€6M', l: 'pipeline voor klanten'},
          ].map((s) => (
            <div
              key={s.n}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px 22px',
                borderRadius: 16,
                background: CARD,
                border: `1px solid ${BORDER}`,
              }}
            >
              <div style={{fontSize: 40, fontWeight: 800, letterSpacing: -1}}>{s.n}</div>
              <div style={{fontSize: 21, color: DEEP, fontWeight: 600, lineHeight: 1.2}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/*  Photo slide: full-bleed photo with the level story on top          */
/* ------------------------------------------------------------------ */
const PhotoSlide: React.FC<{photo: Photo}> = ({photo}) => {
  const top = photo.textAt === 'top';
  return (
    <AbsoluteFill>
      <Img src={staticFile(photo.src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: photo.pos}} />
      {top ? (
        <>
          <AbsoluteFill
            style={{
              background:
                'linear-gradient(180deg, #0F2A1D 0%, rgba(15,42,29,0.96) 30%, rgba(15,42,29,0.8) 44%, rgba(15,42,29,0) 58%)',
            }}
          />
          <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(15,42,29,0.92) 0%, rgba(15,42,29,0.6) 9%, rgba(15,42,29,0) 18%)'}} />
        </>
      ) : (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(15,42,29,0.65) 0%, rgba(15,42,29,0) 15%)'}} />
          <AbsoluteFill
            style={{
              background:
                'linear-gradient(180deg, rgba(15,42,29,0) 46%, rgba(15,42,29,0.78) 62%, rgba(15,42,29,0.95) 76%, #0F2A1D 100%)',
            }}
          />
        </>
      )}
      <div style={{position: 'absolute', left: X, right: X, ...(top ? {top: 190} : {bottom: 130}), color: PAPER}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <div
              style={{
                padding: '9px 16px',
                borderRadius: 10,
                background: SPROUT,
                color: INK,
                fontFamily: MONO,
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 2,
              }}
            >
              LEVEL {photo.level}
            </div>
            <div style={{fontFamily: MONO, fontSize: 21, color: WASH, letterSpacing: 1.5}}>{photo.years}</div>
          </div>
          <LevelMeter level={photo.level} dark />
        </div>
        <div style={{fontSize: 66, fontWeight: 800, lineHeight: 1.04, letterSpacing: -1.6}}>{photo.title}</div>
        <div style={{fontSize: 29, lineHeight: 1.38, color: 'rgba(251,250,245,0.92)', marginTop: 18}}>{photo.text}</div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24}}>
          {photo.chips.map((c) => (
            <div
              key={c}
              style={{
                padding: '8px 15px',
                borderRadius: 10,
                border: '1px solid rgba(200,232,154,0.45)',
                background: 'rgba(15,42,29,0.45)',
                color: WASH,
                fontSize: 21,
                fontWeight: 700,
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/*  Closing                                                            */
/* ------------------------------------------------------------------ */
const Closing: React.FC = () => {
  const levels = [
    {n: 1, t: 'Handmatig ploeteren'},
    {n: 2, t: 'De wirwar aan tools'},
    {n: 3, t: 'De volwassen AI GTM stack'},
  ];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(90% 60% at 80% 0%, rgba(116,189,31,0.22), transparent 60%)'}} />
      <div style={{position: 'absolute', top: 250, left: X, right: X, color: PAPER}}>
        <div style={{fontSize: 70, fontWeight: 800, lineHeight: 1.07, letterSpacing: -1.8}}>
          Het verschil tussen hopen op reacties en een <span style={{color: SPROUT}}>voorspelbare pipeline.</span>
        </div>

        <div style={{fontFamily: MONO, fontSize: 19, letterSpacing: 3, color: SPROUT, marginTop: 56}}>
          OP WELK LEVEL DRAAIT JOUW TEAM?
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16}}>
          {levels.map((l) => (
            <div
              key={l.n}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                padding: '18px 22px',
                borderRadius: 16,
                border: '1px solid rgba(200,232,154,0.28)',
                background: l.n === 3 ? 'rgba(116,189,31,0.16)' : 'rgba(200,232,154,0.06)',
              }}
            >
              <div style={{fontFamily: MONO, fontSize: 20, fontWeight: 800, color: INK, background: l.n === 3 ? SPROUT : WASH, padding: '6px 12px', borderRadius: 8}}>
                LEVEL {l.n}
              </div>
              <div style={{fontSize: 29, fontWeight: 700}}>{l.t}</div>
              <div style={{marginLeft: 'auto'}}>
                <LevelMeter level={l.n} dark />
              </div>
            </div>
          ))}
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 44}}>
          <Img
            src={staticFile('thomas.jpg')}
            style={{width: 96, height: 96, borderRadius: 48, objectFit: 'cover', boxShadow: `0 0 0 3px ${SPROUT}`}}
          />
          <div style={{fontSize: 27, lineHeight: 1.35, color: 'rgba(251,250,245,0.92)'}}>
            Stuur me gerust een bericht als je wilt sparren over <span style={{color: SPROUT, fontWeight: 800}}>de stap naar level 3.</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
