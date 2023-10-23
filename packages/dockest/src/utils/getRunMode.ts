import isDocker from 'is-docker' // eslint-disable-line import/default
import { execaWrapper } from './execaWrapper'
import { TestRunModeType } from '../@types'
import { DockestError } from '../_errors'
import { Logger } from '../_logger'

export const getRunMode = (): TestRunModeType => {
  let mode: TestRunModeType | null = null

  if (isDocker()) {
    const { stdout: result } = execaWrapper(`
      sh -c '
        v=$(mount | grep "/run/docker.sock"); \\
        if [ -n "$v" ]; \\
        then \\
          echo "injected-socket"; \\
        elif [ -S /var/run/docker.sock ]; \\
        then \\
          echo "local-socket"; \\
        else \\
          echo "no-socket"; \\
        fi \\
      '
    `)
    if (result === 'local-socket') {
      mode = 'docker-local-socket'
    } else if (result === 'injected-socket') {
      mode = 'docker-injected-host-socket'
    } else {
      throw new DockestError(`Resolved invalid mode: '${result}'.`)
    }
  } else {
    mode = 'host'
  }

  Logger.debug(`Run dockest in '${mode}' mode.`)

  return mode
}
