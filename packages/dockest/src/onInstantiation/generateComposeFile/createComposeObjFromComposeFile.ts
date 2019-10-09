import mergeDockerComposeConfigFiles from './mergeDockerComposeConfigFiles'
import { ComposeFile } from '../../runners/@types'

export default (composeFiles: string[], nodeProcess = process): ComposeFile => {
  const cwd = nodeProcess.cwd()

  let composeObj = {
    version: '3.7',
    services: {},
  }

  if (composeFiles.length > 0) {
    composeObj = mergeDockerComposeConfigFiles(cwd, composeFiles)
  }

  return composeObj
}
