import checkConnection from './checkConnection'
import checkResponsiveness from './checkResponsiveness'
import resolveContainerId from './resolveContainerId'
import runRunnerCommands from './runRunnerCommands'
import { Runner } from '../../runners/@types'
import { DockestConfig } from '../../index'

const setupRunner = async (runner: Runner) => {
  runner.logger.info('Setup initiated')

  await resolveContainerId(runner)
  await checkConnection(runner)
  await checkResponsiveness(runner)
  await runRunnerCommands(runner)

  runner.logger.info('Setup successful', { nl: 1 })
}

const setupRunnerWithDependencies = async (runner: Runner) => {
  // Setup runner's dependencies
  for (const depRunner of runner.runnerConfig.dependsOn) {
    await setupRunner(depRunner)
  }

  // Setup runner
  await setupRunner(runner)
}

export default async (config: DockestConfig) => {
  const parallelPromises = []

  for (const runner of config.runners) {
    if (!!config.opts.runInBand) {
      await setupRunnerWithDependencies(runner)
    } else {
      parallelPromises.push(setupRunnerWithDependencies(runner))
    }
  }

  await Promise.all(parallelPromises)
}
