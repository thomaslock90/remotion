import React from 'react';
import {Composition} from 'remotion';
import {Carousel, SLIDE_COUNT} from './Carousel';

// One frame per slide: render with --sequence to get one PNG per slide.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Carousel"
      component={Carousel}
      durationInFrames={SLIDE_COUNT}
      fps={1}
      width={1080}
      height={1350}
    />
  );
};
