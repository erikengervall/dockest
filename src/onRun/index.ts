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
  const promises = []
  for (const runner of config.runners) {
    runner.runnerLogger.runnerSetup()

    promises.push(resolveContainerId(runner))
    promises.push(checkConnection(runner))
    promises.push(checkResponsiveness(runner))
    promises.push(runRunnerCommands(runner))

    if (config.runInBand === true) {
      Promise.all(promises)
      promises.length = 0
    }

    runner.runnerLogger.runnerSetupSuccess()
  }

  await Promise.all(promises)
}

const finalResult = (allTestsPassed: boolean) =>
  allTestsPassed ? process.exit(0) : process.exit(1)

export { JestConfig }
export default onRun
