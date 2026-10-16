import React from 'react';
import {AbsoluteFill, Composition, Freeze, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {IcpLoop, IcpLoopSquare, IcpNoise, IcpNoiseSquare} from './IcpNoise';

export const FPS = 30;
export const ANIMATION = 450; // 15s
// The video opens on the finished visual, so the first frame (what players and
// LinkedIn show before playback) is the preview. It then fades into the animation.
export const POSTER = 20;
export const DURATION = POSTER + ANIMATION;
export const WIDTH = 1080;
export const HEIGHT = 1350; // 4:5, LinkedIn feed-native

const WithPoster: React.FC<{format: 'tall' | 'square'}> = ({format}) => {
  const Scene = format === 'square' ? IcpNoiseSquare : IcpNoise;
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: '#FBFAF5'}}>
      <Sequence from={POSTER}>
        <Scene />
      </Sequence>
      <AbsoluteFill style={{opacity: interpolate(frame, [12, POSTER], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        {frame < POSTER ? (
          <Freeze frame={ANIMATION - 1}>
            <Scene />
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
        id="IcpNoise"
        component={WithPoster}
        defaultProps={{format: 'tall' as const}}
        durationInFrames={DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      {/* 1:1 version for the feed */}
      <Composition
        id="IcpNoiseSquare"
        component={WithPoster}
        defaultProps={{format: 'square' as const}}
        durationInFrames={DURATION}
        fps={FPS}
        width={WIDTH}
        height={WIDTH}
      />
      {/* 4 s seamless loop for the LinkedIn GIF (render with --scale to 1200x1500) */}
      <Composition id="IcpLoop" component={IcpLoop} durationInFrames={60} fps={15} width={WIDTH} height={HEIGHT} />
      <Composition id="IcpLoopSquare" component={IcpLoopSquare} durationInFrames={60} fps={15} width={WIDTH} height={WIDTH} />
    </>
  );
};
