import React from 'react';
import {AbsoluteFill, Freeze, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming, type TransitionPresentation} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {PAPER, SCENES, TitleScene} from './scenes';

const T = 10; // transition length: snappy
// The video opens on the finished title card, so the first frame (what LinkedIn shows
// before playback) is the preview; then it plays the title animation.
export const POSTER = 15;
export const EXPLAINER_DURATION = POSTER + SCENES.reduce((a, s) => a + s.dur, 0) - (SCENES.length - 1) * T;

// Mixed slide and wipe presentations; their prop types differ, so widen them for the list
const presentations = [
  slide({direction: 'from-right'}),
  wipe({direction: 'from-left'}),
  slide({direction: 'from-bottom'}),
  wipe({direction: 'from-top-left'}),
] as unknown as TransitionPresentation<Record<string, unknown>>[];

export const Explainer: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: PAPER}}>
      <Sequence from={POSTER}>
        <TransitionSeries>
          {SCENES.map((s, i) => (
            <React.Fragment key={s.name}>
              {i > 0 ? (
                <TransitionSeries.Transition presentation={presentations[i % presentations.length]} timing={linearTiming({durationInFrames: T})} />
              ) : null}
              <TransitionSeries.Sequence durationInFrames={s.dur}>
                <s.C />
              </TransitionSeries.Sequence>
            </React.Fragment>
          ))}
        </TransitionSeries>
      </Sequence>
      {frame < POSTER ? (
        <AbsoluteFill style={{opacity: interpolate(frame, [POSTER - 5, POSTER], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
          <Freeze frame={90}>
            <TitleScene />
          </Freeze>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
