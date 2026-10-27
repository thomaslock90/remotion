import React from 'react';
import {AbsoluteFill, Composition, Freeze, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {RevenueKnobs, RevenueKnobsLoop} from './RevenueKnobs';

export const FPS = 30;
export const ANIMATION = 450; // 15s
// The video opens on the finished visual, so the first frame (what players and
// LinkedIn show before playback) is the preview. It then fades into the animation.
export const POSTER = 20;
export const SIZE = 1080; // 1:1, LinkedIn feed

const WithPoster: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: '#FBFAF5'}}>
      <Sequence from={POSTER}>
        <RevenueKnobs />
      </Sequence>
      <AbsoluteFill style={{opacity: interpolate(frame, [12, POSTER], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        {frame < POSTER ? (
          <Freeze frame={ANIMATION - 1}>
            <RevenueKnobs />
          </Freeze>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RevenueKnobs"
        component={WithPoster}
        durationInFrames={POSTER + ANIMATION}
        fps={FPS}
        width={SIZE}
        height={SIZE}
      />
      {/* 4 s seamless loop for the LinkedIn GIF (render with --scale to 1200x1200) */}
      <Composition id="RevenueKnobsLoop" component={RevenueKnobsLoop} durationInFrames={60} fps={15} width={SIZE} height={SIZE} />
    </>
  );
};
