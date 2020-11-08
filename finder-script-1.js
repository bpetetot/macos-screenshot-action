const path = require('path')
const MacRunner = require('./mac-runner');

const IMAGES_PATH = path.resolve(`./images`)
const VIDEOS_PATH = path.resolve(`./videos`)

module.exports = {
  run: async () => {
    console.log('> Recording...');

    const runner = new MacRunner()

    await runner
      .setDefault('com.apple.Finder', 'AppleShowAllFiles', '-bool false', 'killall Finder')
      .openFinder('~')
      .moveAndResizeApp('Finder', 0, 0, 800, 500)
      .captureApp('Finder', `${IMAGES_PATH}/show-all-false.png`)
      .startVideo()
      .wait(5000)
      .stopVideo(`${VIDEOS_PATH}/video.mkv`)
      .setDefault('com.apple.Finder', 'AppleShowAllFiles', '-bool true', 'killall Finder')
      .run();
  },
};
