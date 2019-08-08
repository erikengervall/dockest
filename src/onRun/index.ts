import dockerComposeUp from './dockerComposeUp'
import runJest from './runJest'
import waitForRunnersReadiness from './waitForRunnersReadiness'
import { DockestConfig } from '../index'
import Logger from '../Logger'
import sleepForX from '../utils/sleepForX'
import teardownSingle from '../utils/teardownSingle'

const onRun = async (config: DockestConfig) => {
  const {
    $: { dockerComposeGeneratedPath, perfStart },
    opts: {
      afterSetupSleep,
      dev: { debug },
    },
  } = config

  await dockerComposeUp(dockerComposeGeneratedPath)

  await waitForRunnersReadiness(config)

  if (afterSetupSleep > 0) {
    await sleepForX('After setup sleep', afterSetupSleep)
  }

  if (debug) {
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

  Logger.perf(perfStart)
  allTestsPassed ? process.exit(0) : process.exit(1)
}

export default onRun
