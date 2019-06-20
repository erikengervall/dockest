import Dockest, { DockestConfig } from '..'
import { globalLogger } from '../loggers'
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

  if (config.dev.idling) {
    globalLogger.info(`Dev mode enabled: Jest will not run.`)
    return // Will keep the docker containers running indefinitely
  }

  if (config.afterSetupSleep > 0) {
    await sleepWithLog('After setup sleep progress', config.afterSetupSleep)
  }

  const allTestsPassed = await runJest(config)
  Dockest.config.jestRanWithResult = true

  for (const runner of config.runners) {
    await teardownSingle(runner)
  }

  finalResult(allTestsPassed)
}

const preperation = async (config: DockestConfig) => {
  const parallelPromises = []

  for (const runner of config.runners) {
    const work = async () => {
      runner.runnerLogger.runnerSetup()

      await resolveContainerId(runner)
      await checkConnection(runner)
      await checkResponsiveness(runner)
      await runRunnerCommands(runner)

      runner.runnerLogger.runnerSetupSuccess()
    }

    !!config.runInBand ? await work() : parallelPromises.push(work)
  }

  await Promise.all(parallelPromises)
}

const finalResult = (allTestsPassed: boolean) =>
  allTestsPassed ? (process.exitCode = 0) : (process.exitCode = 1)
// allTestsPassed ? process.exit(0) : process.exit(1)

export { JestConfig }
export default onRun
