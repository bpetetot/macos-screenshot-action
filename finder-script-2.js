const path = require('path')
const MacRunner = require('./mac-runner');

const IMAGES_PATH = path.resolve(`./images`)

module.exports = {
  run: async () => {
    console.log('> Recording...')

    const runner = new MacRunner()

    await runner
      .setDefault('com.apple.Finder', 'AppleShowAllFiles', '-bool true', 'killall Finder')
      .openFinder('~')
      .moveAndResizeApp('Finder', 0, 0, 800, 500)
      .captureApp('Finder', `${IMAGES_PATH}/show-all-true.png`)
      .setDefault('com.apple.Finder', 'AppleShowAllFiles', '-bool false', 'killall Finder')
      .run();
  }
}
