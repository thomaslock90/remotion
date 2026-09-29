import React from 'react';
import {Composition} from 'remotion';
import {DncFlow} from './DncFlow';

export const FPS = 30;
export const DURATION = 360; // 12s
export const WIDTH = 1080;
export const HEIGHT = 1350; // 4:5, LinkedIn feed-native

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DncFlow"
      component={DncFlow}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
