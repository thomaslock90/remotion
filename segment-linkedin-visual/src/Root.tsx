import React from 'react';
import {AbsoluteFill, Composition, Freeze, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {SegmentSplit} from './SegmentSplit';

export const FPS = 30;
export const ANIMATION = 450; // 15s
// The video opens on the finished visual, so the first frame (what players and
// LinkedIn show before playback) is the preview. It then fades into the animation.
export const POSTER = 20;
export const DURATION = POSTER + ANIMATION;
export const WIDTH = 1080;
export const HEIGHT = 1350; // 4:5, LinkedIn feed-native

const WithPoster: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: '#FBFAF5'}}>
      <Sequence from={POSTER}>
        <SegmentSplit />
      </Sequence>
      <AbsoluteFill style={{opacity: interpolate(frame, [12, POSTER], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        {frame < POSTER ? (
          <Freeze frame={ANIMATION - 1}>
            <SegmentSplit />
          </Freeze>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SegmentSplit"
      component={WithPoster}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
