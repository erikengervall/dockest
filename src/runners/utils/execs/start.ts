import { runnerLogger } from '../../../loggers'
import { ExecOpts, RunnerConfigs } from '../../index'
import { execa, getContainerId, teardown } from '../index'

const start = async (runnerConfig: RunnerConfigs, execOpts: ExecOpts): Promise<string> => {
  const { service } = runnerConfig
  const { commandCreators } = execOpts
  const startCommand = commandCreators.createStartCommand(runnerConfig)
  runnerLogger.startContainer()

  let containerId = await getContainerId(service)
  if (!containerId) {
    await execa(startCommand)
  } else {
    await teardown({ ...execOpts, containerId })

    return start(runnerConfig, execOpts)
  }
  containerId = await getContainerId(service)
  runnerLogger.startContainerSuccess()

  return containerId
}

export default start
