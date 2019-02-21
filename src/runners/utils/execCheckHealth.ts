import execa from 'execa'

import { DockestError } from '../../errors'
import { runnerLogger } from '../../loggers'
import { ExecOpts, RunnerConfigs } from '../index'
import { acquireConnection, sleep } from './index'

export default async (runnerConfig: RunnerConfigs, execOpts: ExecOpts) => {
  const { runnerKey } = execOpts
  runnerLogger.checkHealth(runnerKey)

  await checkConnection(runnerConfig, execOpts)
  await checkResponsiveness(runnerConfig, execOpts)

  runnerLogger.checkHealthSuccess(runnerKey)
}

// TODO: no-any
const checkConnection = async (runnerConfig: any, execOpts: ExecOpts): Promise<void> => {
  const { service, connectionTimeout, host, port } = runnerConfig
  const { runnerKey } = execOpts

  const recurse = async (connectionTimeout: number) => {
    runnerLogger.checkConnection(connectionTimeout)

    if (connectionTimeout <= 0) {
      throw new DockestError(`${service} connection timed out`)
    }

    try {
      await acquireConnection(port, host)

      runnerLogger.checkConnectionSuccess(runnerKey)
    } catch (error) {
      connectionTimeout--

      await sleep(1000)
      await recurse(connectionTimeout)
    }
  }

  await recurse(connectionTimeout)
}

// TODO: no-any
const checkResponsiveness = async (runnerConfig: any, execOpts: ExecOpts) => {
  const { service, responsivenessTimeout } = runnerConfig
  const {
    runnerKey,
    commandCreators: { createCheckResponsivenessCommand },
  } = execOpts
  if (!createCheckResponsivenessCommand) {
    return Promise.resolve()
  }
  const cmd = createCheckResponsivenessCommand(runnerConfig, execOpts)

  const recurse = async (responsivenessTimeout: number): Promise<void> => {
    runnerLogger.checkResponsiveness(responsivenessTimeout)

    if (responsivenessTimeout <= 0) {
      throw new DockestError(`${service} responsiveness timed out`)
    }

    try {
      runnerLogger.shellCmd(cmd)
      await execa.shell(cmd)

      runnerLogger.checkResponsivenessSuccess(runnerKey)
    } catch (error) {
      responsivenessTimeout--

      await sleep(1000)
      await recurse(responsivenessTimeout)
    }
  }

  await recurse(responsivenessTimeout)
}
