import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setConcurrency(1);
Config.setQuality(80);
Config.setPixelFormat('yuv420p');

// Increase timeout for long videos
Config.setTimeoutInMilliseconds(300000);

// Browser executable path (optional, uncomment if needed)
// Config.setBrowserExecutable('/path/to/chrome');

// Webpack override for custom configurations
Config.overrideWebpackConfig((currentConfiguration) => {
  return {
    ...currentConfiguration,
    resolve: {
      ...currentConfiguration.resolve,
      alias: {
        ...currentConfiguration.resolve?.alias,
        '@': require('path').resolve(__dirname, './'),
      },
    },
  };
});
