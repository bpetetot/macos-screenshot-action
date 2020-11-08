const delay = require('delay')
const { spawn } = require('child_process')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

async function execCommand(command, waitDelay = 1000) {
  console.info(`   Command: [${command}]`)
  const { stderr } = await exec(command)
  if (stderr) {
    throw new Error(stderr)
  }
  await delay(waitDelay)
}

async function appCapture(appName, file) {
  await makeAppActive(appName)
  delay(1000)
  await execCommand(`screencapture -l$(osascript -e 'tell app "${appName}" to id of window 1') ${file}`)
}

async function makeAppActive(appName) {
  return new Promise((resolve, reject) => {
    const osascript = spawn('osascript', ['-e', 'try', '-e', `tell application "${appName}" to activate`, '-e', 'end try'])

    if (process.env.NODE_ENV === 'DEBUG') {
      osascript.stderr.on('data', function (message) {
        console.debug(`${message}`)
      })
    }

    osascript.on('exit', osascriptExitCode => {
      if (osascriptExitCode === '1') {
        return reject('osascript')
      }

      resolve()
    })
  })
}

module.exports = {
  execCommand,
  appCapture,
  makeAppActive,
}