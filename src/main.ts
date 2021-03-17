import * as core from '@actions/core'
import * as constants from './constants'
import {getAllurectl} from './installer'

async function run(): Promise<void> {
  try {
    const version = core.getInput(constants.INPUT_VERSION)
    const arch = core.getInput(constants.INPUT_ARCHITECTURE, {required: true})
    if (!['x86', 'x64'].includes(arch)) {
      throw new Error(`architecture "${arch}" is not in [x86 | x64]`)
    }

    await getAllurectl(version, arch)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
