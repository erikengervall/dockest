import execa from 'execa'

import { DockestError } from '../errors'
import { RunnerLogger } from '../loggers'
import { ExecOpts, RunnerConfigs } from './index'
import { acquireConnection, getContainerId, sleep, teardownSingle } from './utils'

const start = async (runnerConfig: RunnerConfigs, execOpts: ExecOpts) => {
  const { service } = runnerConfig
  const { runnerKey, commandCreators } = execOpts
  const startCommand = commandCreators.createStartCommand(runnerConfig)
  RunnerLogger.startContainer(runnerKey)

  let containerId = await getContainerId(service)
  if (!containerId) {
    RunnerLogger.shellCmd(startCommand)
    await execa.shell(startCommand)
  }
  containerId = await getContainerId(service)

  RunnerLogger.startContainerSuccess(runnerKey)

  return containerId
}

const checkHealth = async (runnerConfig: RunnerConfigs, execOpts: ExecOpts) => {
  const { runnerKey } = execOpts
  RunnerLogger.checkHealth(runnerKey)

  await checkConnection(runnerConfig, execOpts)
  await checkResponsiveness(runnerConfig, execOpts)

  RunnerLogger.checkHealthSuccess(runnerKey)
}

const teardown = async (execConfig: ExecOpts) => {
  const { containerId, runnerKey } = execConfig
  return teardownSingle(containerId, runnerKey)
}

// TODO: no-any
const checkConnection = async (runnerConfig: any, execOpts: ExecOpts): Promise<void> => {
  const { service, connectionTimeout, host, port } = runnerConfig
  const { runnerKey } = execOpts

  const recurse = async (connectionTimeout: number) => {
    RunnerLogger.checkConnection(runnerKey, connectionTimeout)

    if (connectionTimeout <= 0) {
      throw new DockestError(`${service} connection timed out`)
    }

    try {
      await acquireConnection(port, host)

      RunnerLogger.checkConnectionSuccess(runnerKey)
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
    RunnerLogger.checkResponsiveness(runnerKey, responsivenessTimeout)

    if (responsivenessTimeout <= 0) {
      throw new DockestError(`${service} responsiveness timed out`)
    }

    try {
      RunnerLogger.shellCmd(cmd)
      await execa.shell(cmd)

      RunnerLogger.checkResponsivenessSuccess(runnerKey)
    } catch (error) {
      responsivenessTimeout--

      await sleep(1000)
      await recurse(responsivenessTimeout)
    }
  }

  await recurse(responsivenessTimeout)
}

export { start, checkHealth, teardown }
