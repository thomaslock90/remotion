import React from 'react';
import {Composition} from 'remotion';
import {EXPLAINER_DURATION, Explainer} from './Explainer';
import {BOARD_H, BOARD_W, Moodboard} from './Moodboard';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Explainer" component={Explainer} durationInFrames={EXPLAINER_DURATION} fps={30} width={1080} height={1080} />
      <Composition id="Moodboard" component={Moodboard} durationInFrames={300} fps={30} width={BOARD_W} height={BOARD_H} />
    </>
  );
};
