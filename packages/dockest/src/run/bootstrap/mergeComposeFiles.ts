import path from 'path'
import { DockestConfig } from '../../@types'
import { DockestError } from '../../Errors'
import { execaWrapper } from '../../utils/execaWrapper'

export async function mergeComposeFiles(composeFile: DockestConfig['composeFile'], nodeProcess = process) {
  const composeFiles = []
  if (Array.isArray(composeFile)) {
    composeFiles.push(...composeFile)
  } else {
    composeFiles.push(composeFile)
  }

  const dockerComposeConfigCommand = `${composeFiles.reduce(
    (commandAcc, composePath) => (commandAcc += ` -f ${path.join(nodeProcess.cwd(), composePath)}`),
    'docker-compose',
  )} config`

  const { stderr, exitCode, stdout: mergedComposeFiles } = execaWrapper(dockerComposeConfigCommand, {
    execaOpts: { reject: false },
    logStdout: true,
  })

  if (exitCode !== 0) {
    throw new DockestError('Invalid Compose file(s)', {
      error: stderr,
    })
  }

  return {
    mergedComposeFiles,
  }
}
