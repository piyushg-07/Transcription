const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');
const path = require('path');

async function renderVideo() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('Usage: node render-video.js <videoPath> <captionsJson> <styleName>');
    console.error('Example: node render-video.js ./video.mp4 ./captions.json netflix');
    process.exit(1);
  }

  const [videoPath, captionsPath, styleName] = args;
  
  try {
    console.log('Loading data...');
    const captions = require(path.resolve(captionsPath));
    const { getStylePreset } = require('../lib/caption-styles');
    const style = getStylePreset(styleName);

    console.log('Bundling Remotion...');
    const bundleLocation = await bundle({
      entryPoint: path.join(__dirname, '..', 'remotion', 'index.ts'),
      webpackOverride: (config) => config,
    });

    console.log('Getting composition...');
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'CaptionedVideo',
      inputProps: {
        videoSrc: path.resolve(videoPath),
        captions,
        style,
      },
    });

    const outputPath = path.join(__dirname, '..', 'output', `rendered-${Date.now()}.mp4`);
    
    console.log('Rendering video...');
    console.log(`Output: ${outputPath}`);
    
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {
        videoSrc: path.resolve(videoPath),
        captions,
        style,
      },
      onProgress: ({ progress }) => {
        console.log(`Progress: ${Math.round(progress * 100)}%`);
      },
    });

    console.log('✅ Rendering complete!');
    console.log(`Output file: ${outputPath}`);
  } catch (error) {
    console.error('❌ Rendering failed:', error);
    process.exit(1);
  }
}

renderVideo();
