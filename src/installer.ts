import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'

const downloadUrl = (version: string, arch: string): string =>
  `https://bintray.com/qameta/generic/download_file?file_path=allurectl%2F${version}%2Fallurectl_${arch2suffix(
    arch
  )}`
const arch2suffix = (arch: string): string => {
  if (arch === 'x86') {
    return IS_WINDOWS ? 'windows_386.exe' : 'linux_386'
  }
  if (arch === 'x64') {
    return IS_WINDOWS ? 'windows_amd64.exe' : 'linux_amd64'
  }
  throw new Error(`unsupported arch ${arch}`)
}

const IS_WINDOWS = isWindows()

export async function getAllurectl(
  version: string,
  arch: string
): Promise<void> {
  const toolPath = tc.find('allurectl', version, arch)
  if (toolPath) {
    core.debug(`Tool found in cache ${toolPath}`)
  } else {
    const allurectlBinary = await tc.downloadTool(downloadUrl(version, arch))
    const path = await tc.cacheFile(
      allurectlBinary,
      'allurectl',
      'allurectl',
      version,
      arch
    )
    core.addPath(path)
  }
}

export function isWindows(): boolean {
  return process.platform === 'win32'
}
