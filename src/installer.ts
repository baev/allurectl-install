import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import {promises as fsp} from 'fs'

const IS_WINDOWS = isWindows()
const IS_DARWIN = isDarwin()

const downloadUrl = (version: string, arch: string): string =>
  `https://github.com/allure-framework/allurectl/releases/download/${version}/allurectl_${arch2suffix(
    arch
  )}`
const arch2suffix = (arch: string): string => {
  if (IS_DARWIN) {
    return 'darwin_amd64'
  }
  if (IS_WINDOWS) {
    return arch === 'x86' ? 'windows_386.exe' : 'windows_amd64.exe'
  }
  return arch === 'x86' ? 'linux_386' : 'linux_amd64'
}

export async function getAllurectl(
  version: string,
  arch: string
): Promise<void> {
  let toolPath = tc.find('allurectl', version, arch)
  if (toolPath) {
    core.debug(`Tool found in cache ${toolPath}`)
  } else {
    const allurectlBinary = await tc.downloadTool(downloadUrl(version, arch))
    core.debug(`Tool downloaded to ${allurectlBinary}`)
    await fsp.chmod(allurectlBinary, 0o755)
    toolPath = await tc.cacheFile(
      allurectlBinary,
      'allurectl',
      'allurectl',
      version,
      arch
    )
    core.debug(`Tool cached ${toolPath}`)
  }

  core.addPath(toolPath)
}

export function isWindows(): boolean {
  return process.platform === 'win32'
}

export function isDarwin(): boolean {
  return process.platform === 'darwin'
}
