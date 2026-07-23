import React from 'react';
import {Composition} from 'remotion';
import {GtmFlow} from './GtmFlow';

export const FPS = 30;
export const DURATION = 450; // 15s
export const WIDTH = 1080;
export const HEIGHT = 1350; // 4:5, LinkedIn feed-native

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="GtmFlow"
      component={GtmFlow}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
