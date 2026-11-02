import React from 'react';
import {Composition} from 'remotion';
import {BOARD_H, BOARD_W, Moodboard} from './Moodboard';

export const RemotionRoot: React.FC = () => {
  return <Composition id="Moodboard" component={Moodboard} durationInFrames={1} fps={30} width={BOARD_W} height={BOARD_H} />;
};
