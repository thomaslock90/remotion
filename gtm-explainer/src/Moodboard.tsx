import React from 'react';
import {AbsoluteFill, Freeze} from 'remotion';
import {DEEP, INK, MONO, PAPER, SANS, SCENES, SPROUT, WASH} from './scenes';

const S = 540; // each 1080 frame shown at 50%
const GAP = 30;
const ROWS = Math.ceil(SCENES.length / 3);
export const BOARD_W = 3 * S + 4 * GAP;
export const BOARD_H = 250 + ROWS * (S + 80) + GAP;

export const Moodboard: React.FC = () => (
  <AbsoluteFill style={{background: '#E9E7DE', fontFamily: SANS, color: INK}}>
    <div style={{position: 'absolute', left: GAP, right: GAP, top: 36}}>
      <div style={{fontFamily: MONO, fontSize: 20, letterSpacing: 4, color: DEEP}}>MOODBOARD · EXPLAINER “WAT IS GTM ENGINEERING?”</div>
      <div style={{fontSize: 56, fontWeight: 800, letterSpacing: -1.5, marginTop: 10}}>Snel, groot, Sowly-groen</div>
      <div style={{display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap'}}>
        {['Beats van 2–4 s', 'Kinetische typografie: woorden slaan in', 'Harde cuts + groene wipes', 'Snap-zooms en tellers', 'Afwisselend donker · crème · Sprout', '1:1 · ±60 s · alleen tekst'].map((t) => (
          <div key={t} style={{padding: '8px 14px', borderRadius: 10, background: PAPER, fontSize: 19, fontWeight: 700}}>
            {t}
          </div>
        ))}
        <div style={{display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto'}}>
          {[INK, '#2F6B45', SPROUT, WASH, PAPER].map((c) => (
            <div key={c} style={{width: 34, height: 34, borderRadius: 8, background: c, border: '1px solid rgba(15,42,29,0.15)'}} />
          ))}
        </div>
      </div>
    </div>
    {SCENES.map((f, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      return (
        <div key={f.name} style={{position: 'absolute', left: GAP + col * (S + GAP), top: 250 + row * (S + 80)}}>
          <div style={{width: S, height: S, overflow: 'hidden', borderRadius: 14, boxShadow: '0 10px 30px rgba(15,42,29,0.15)'}}>
            <div style={{width: 1080, height: 1080, transform: 'scale(0.5)', transformOrigin: 'top left', position: 'relative'}}>
              <Freeze frame={f.dur - 1}>
                <f.C />
              </Freeze>
            </div>
          </div>
          <div style={{display: 'flex', gap: 10, alignItems: 'baseline', marginTop: 10}}>
            <span style={{fontSize: 20, fontWeight: 800}}>{f.name}</span>
            <span style={{fontSize: 17, color: DEEP}}>{f.motion}</span>
          </div>
        </div>
      );
    })}
  </AbsoluteFill>
);
