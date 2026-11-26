import React from 'react';
import {Composition} from 'remotion';
import {DURATION, Target2027} from './Target2027';

export const RemotionRoot: React.FC = () => (
  <Composition id="Target2027" component={Target2027} durationInFrames={DURATION} fps={30} width={1080} height={1080} />
);
