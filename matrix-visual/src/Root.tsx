import React from 'react';
import {Composition} from 'remotion';
import {LOOP, Matrix} from './Matrix';

// Seamless GIF loop at 15 fps; render with --scale=1.1111111 for 1200x1200
export const RemotionRoot: React.FC = () => (
  <Composition id="Matrix" component={Matrix} durationInFrames={LOOP} fps={15} width={1080} height={1080} />
);
