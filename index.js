const script1 = require('./finder-script-1')
const script2 = require('./finder-script-2')

const execute = async () => {
  try {
    console.info(`\nStart screenshots.\n`)

    await script1.run()
    await script2.run()

    console.info(`\nAll screenshots were successfully recorded.\n`)
  } catch (error) {
    console.log(error)
  }
}

execute()