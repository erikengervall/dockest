import Dockest, { DockestConfig } from '../index'
import { globalLogger } from '../loggers'
import { Runner } from '../runners/@types'
import {
  checkConnection,
  checkResponsiveness,
  resolveContainerId,
  runRunnerCommands,
  sleepWithLog,
  teardownSingle,
} from '../utils'
import dockerComposeUp from './dockerComposeUp'
import runJest, { JestConfig } from './runJest'

const onRun = async (config: DockestConfig) => {
  const { DOCKER_COMPOSE_GENERATED_PATH } = config

  dockerComposeUp(DOCKER_COMPOSE_GENERATED_PATH)

  await preperation(config)

  if (config.afterSetupSleep > 0) {
    await sleepWithLog('After setup sleep progress', config.afterSetupSleep)
  }

  if (config.dev.idling) {
    globalLogger.info(`Dev mode enabled: Jest will not run.`)
    config.runners.forEach((runner, index) =>
      globalLogger.info(
        `[${index}] ${JSON.stringify(
          {
            service: runner.runnerConfig.service,
            containerId: runner.containerId,
            dependsOn: runner.runnerConfig.dependsOn,
          },
          null,
          2
        )}\n`
      )
    )
    return // Will keep the docker containers running indefinitely
  }

  const allTestsPassed = await runJest(config)
  Dockest.config.jestRanWithResult = true

  for (const runner of config.runners) {
    await teardownSingle(runner)
  }

  exitProcessWithCode(allTestsPassed)
}

const preperation = async (config: DockestConfig) => {
  const parallelPromises = []

  for (const runner of config.runners) {
    const work = (runner: Runner) => async () => {
      runner.runnerLogger.runnerSetup()

      await resolveContainerId(runner)
      await checkConnection(runner)
      await checkResponsiveness(runner)
      await runRunnerCommands(runner)

      runner.runnerLogger.runnerSetupSuccess()
    }

    !!config.runInBand ? await work(runner)() : parallelPromises.push(work(runner))
  }

  await Promise.all(parallelPromises)
}

const exitProcessWithCode = (allTestsPassed: boolean) =>
  allTestsPassed ? process.exit(0) : process.exit(1)

export { JestConfig }
export default onRun
