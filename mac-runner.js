const aperture = require('aperture')();
const wait = require('delay')
const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const { spawn } = require('child_process')

class MacRunner {
  constructor(commands = []) {
    this.commands = commands
  }

  setDefault(domain, key, params, after) {
    return this.register(() => {
      const defaultCommand = `defaults write ${domain} ${key} ${params}`
      const command = after ? `${defaultCommand} && ${after}` : defaultCommand
      return execCommand(command)
    })
  }

  openFinder(folder) {
    return this.register(() => execCommand(`open ${folder}`))
  }

  activeApp(appName) {
    return this.register(() => execCommand(`osascript -e 'tell application "${appName}" to activate'`))
  }

  captureApp(appName, file) {
    return this.register(() => execCommand(`screencapture -l$(osascript -e 'tell app "${appName}" to id of window 1') ${file}`))
  }

  startVideo(options) {
    return this.register(async () => {
      console.info('   Start video recording...')
      await aperture.startRecording(options);
      await aperture.isFileReady;
    })
  }

  stopVideo(file) {
    return this.register(async () => {
      console.info('   Stop video recording...')
      const fp = await aperture.stopRecording()
      if (fs.existsSync(file)) {
        fs.unlinkSync(file)
      }
      fs.renameSync(fp, file);
    })
  }

  moveAndResizeApp(appName, x, y, width, height) {
    const h = { start: x, end: x + width }
    const v = { start: y, end: y + height }
    return this.register(() => execCommand(`osascript -e 'tell application "${appName}" to set the bounds of the first window to {${h.start}, ${v.start}, ${h.end}, ${v.end}}'`))
  }

  wait(delay) {
    return this.register(() => wait(delay))
  }

  async run() {
    await this.commands.reduce((p, fn) => p.then(fn), Promise.resolve())
  }

  register(command) {
    this.commands.push(command)
    return new MacRunner(this.commands)
  }
}

async function execCommand(command, delay = 1000) {
  console.info(`   Command: [${command}]`)
  const { stderr } = await exec(command)
  if (stderr) {
    throw new Error(stderr)
  }
  await wait(delay)
}

module.exports = MacRunner