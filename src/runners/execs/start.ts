import execa from 'execa'

import { runnerLogger } from '../../loggers'
import { ExecOpts, RunnerConfigs } from '../index'
import { getContainerId } from '../utils'

export default async (runnerConfig: RunnerConfigs, execOpts: ExecOpts) => {
  const { service } = runnerConfig
  const { runnerKey, commandCreators } = execOpts
  const startCommand = commandCreators.createStartCommand(runnerConfig)
  runnerLogger.startContainer(runnerKey)

  let containerId = await getContainerId(service)
  if (!containerId) {
    runnerLogger.shellCmd(startCommand)
    await execa.shell(startCommand)
  }
  containerId = await getContainerId(service)

  runnerLogger.startContainerSuccess(runnerKey)

  return containerId
}
