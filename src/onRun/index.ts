import dockerComposeUp from './dockerComposeUp'
import runJest from './runJest'
import waitForRunnersReadiness from './waitForRunnersReadiness'
import createBridgeNetwork from './createBridgeNetwork'
import joinBridgeNetwork from './joinBridgeNetwork'
import removeBridgeNetwork from './removeBridgeNetwork'
import leaveBridgeNetwork from './leaveBridgeNetwork'
import { DockestConfig } from '../index'
import Logger from '../Logger'
import sleepForX from '../utils/sleepForX'
import teardownSingle from '../utils/teardownSingle'

const onRun = async (config: DockestConfig) => {
  const {
    $: { perfStart, isInsideDockerContainer, hostname },
    opts: {
      afterSetupSleep,
      dev: { debug },
    },
    runners,
  } = config

  await dockerComposeUp(runners.map(runner => runner.runnerConfig.service))

  if (isInsideDockerContainer) {
    await createBridgeNetwork()
    await joinBridgeNetwork(hostname)
  }

  await waitForRunnersReadiness(config)

  if (afterSetupSleep > 0) {
    await sleepForX('After setup sleep', afterSetupSleep)
  }

  if (debug || process.argv.includes('dev') || process.argv.includes('debug')) {
    Logger.info(`Debug mode enabled, containers are kept running and Jest will not run.`)

    config.runners.forEach((runner, index) =>
      Logger.info(
        `[${index + 1}/${config.runners.length} | ${runner.runnerConfig.service}] ${JSON.stringify(
          {
            service: runner.runnerConfig.service,
            containerId: runner.containerId,
            dependsOn: runner.runnerConfig.dependsOn,
          },
          null,
          2,
        )}\n`,
      ),
    )

    return // Keep the docker containers running indefinitely
  }

  const allTestsPassed = await runJest(config)

  for (const runner of config.runners) {
    await teardownSingle(runner)
  }

  if (isInsideDockerContainer) {
    await leaveBridgeNetwork(hostname)
    await removeBridgeNetwork()
  }

  Logger.perf(perfStart)
  allTestsPassed ? process.exit(0) : process.exit(1)
}

export default onRun
