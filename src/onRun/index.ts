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
import JestRunner from './jest'

const onRun = async (config: DockestConfig) => {
  const { DOCKER_COMPOSE_GENERATED_PATH } = config
  const jestRunner = new JestRunner(config.jest)

  dockerComposeUp(DOCKER_COMPOSE_GENERATED_PATH)

  const promises = []
  for (const runner of config.runners) {
    runner.runnerLogger.runnerSetup()

    if (!!config.runInBand) {
      await resolveContainerId(runner)
      await checkConnection(runner)
      await checkResponsiveness(runner)
      await runRunnerCommands(runner)
    } else {
      promises.push(resolveContainerId(runner))
      promises.push(checkConnection(runner))
      promises.push(checkResponsiveness(runner))
      promises.push(runRunnerCommands(runner))
    }

    // Round up
    runner.runnerLogger.runnerSetupSuccess()
  }
  await Promise.all(promises)

  if (config.dev.idling) {
    globalLogger.info(`Dev mode enabled: Jest will not run.`)
    return // Will keep the docker containers running indefinitely
  }

  if (config.afterSetupSleep > 0) {
    await sleepWithLog('After setup sleep progress', config.afterSetupSleep)
  }

  const result = await jestRunner.run()
  Dockest.config.jestRanWithResult = true

  for (const runner of config.runners) {
    await teardownSingle(runner)
  }

  result.success ? process.exit(0) : process.exit(1)
}

export default onRun
