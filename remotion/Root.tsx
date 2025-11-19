import { Composition } from 'remotion';
import { CaptionedVideo } from './compositions/CaptionedVideo';
import { CaptionSegment, CaptionStyle } from '@/types';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          videoSrc: '',
          captions: [] as CaptionSegment[],
          style: {} as CaptionStyle,
        }}
      />
    </>
  );
};
