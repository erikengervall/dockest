import checkConnection from './checkConnection'
import checkResponsiveness from './checkResponsiveness'
import resolveContainerId from './resolveContainerId'
import runRunnerCommands from './runRunnerCommands'
import { Runner } from '../../runners/@types'
import { DockestConfig } from '../../index'
import joinBridgeNetwork from '../joinBridgeNetwork'

const setupRunner = async (runner: Runner, initializer: string, mustJoinBridgeNetwork: boolean) => {
  runner.logger.info('Setup initiated')

  await resolveContainerId(runner)
  if (mustJoinBridgeNetwork) {
    await joinBridgeNetwork(runner.containerId, runner.runnerConfig.service)
  }
  await checkConnection(runner)
  await checkResponsiveness(runner)
  await runRunnerCommands(runner)
  runner.initializer = initializer

  runner.logger.info('Setup successful', { nl: 1 })
}

const setupIfNotOngoing = async (runner: Runner, initializer: string, mustJoinBridgeNetwork: boolean) => {
  if (!!runner.initializer) {
    runner.logger.info(
      `"${runner.runnerConfig.service}" has already been setup by "${runner.initializer}" - skipping`,
      { nl: 1 },
    )
  } else {
    await setupRunner(runner, initializer, mustJoinBridgeNetwork)
  }
}

const setupRunnerWithDependencies = async (runner: Runner, mustJoinBridgeNetwork: boolean) => {
  // Setup runner's dependencies
  for (const depRunner of runner.runnerConfig.dependsOn) {
    await setupIfNotOngoing(depRunner, runner.runnerConfig.service, mustJoinBridgeNetwork)
  }

  await setupIfNotOngoing(runner, runner.runnerConfig.service, mustJoinBridgeNetwork)
}

export default async (config: DockestConfig) => {
  const setupPromises = []

  for (const runner of config.runners) {
    if (!!config.opts.runInBand) {
      await setupRunnerWithDependencies(runner, config.$.isInsideDockerContainer)
    } else {
      setupPromises.push(setupRunnerWithDependencies(runner, config.$.isInsideDockerContainer))
    }
  }

  await Promise.all(setupPromises)
}
