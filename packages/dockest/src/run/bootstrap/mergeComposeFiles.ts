import path from 'path'
import { DockestConfig } from '../../@types'
import { DockestError } from '../../Errors'
import { execaWrapper } from '../../utils/execaWrapper'

export const mergeComposeFiles = async (config: DockestConfig, nodeProcess = process) => {
  const {
    opts: { composeFile = [] },
  } = config

  const composeFiles = []
  if (Array.isArray(composeFile)) {
    composeFiles.push(...composeFile)
  } else {
    composeFiles.push(composeFile)
  }

  const command = `${composeFiles.reduce(
    (acc, curr) => (acc += ` -f ${path.join(nodeProcess.cwd(), curr)}`),
    'docker-compose',
  )} config`

  const { stderr, exitCode, stdout } = await execaWrapper(command, {
    execaOpts: { reject: false },
    logStdout: true,
  })

  if (exitCode !== 0) {
    throw new DockestError('Invalid Compose file(s)', {
      error: stderr,
    })
  }

  return {
    mergedComposeFiles: stdout,
  }
}
