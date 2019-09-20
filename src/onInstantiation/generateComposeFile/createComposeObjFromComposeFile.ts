import { ComposeFile } from '../../runners/@types'
import mergeDockerComposeConfigFiles from './mergeDockerComposeConfigFiles'

export default (composeFiles: string[], nodeProcess = process): ComposeFile => {
  const cwd = nodeProcess.cwd()

  let composeObj = {
    version: '3',
    services: {},
  }

  if (composeFiles.length > 0) {
    composeObj = mergeDockerComposeConfigFiles(cwd, composeFiles)
  }

  return composeObj
}
