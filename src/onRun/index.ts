import { DockestConfig } from '../index'
import globalLogger from '../loggers/globalLogger'
import sleepForX from '../utils/sleepForX'
import teardownSingle from '../utils/teardownSingle'
import dockerComposeUp from './dockerComposeUp'
import runJest from './runJest'
import waitForRunnersReadyness from './waitForRunnersReadyness'

const onRun = async (config: DockestConfig) => {
  const {
    $: { dockerComposeGeneratedPath, perfStart },
    opts: {
      afterSetupSleep,
      dev: { debug },
    },
  } = config

  dockerComposeUp(dockerComposeGeneratedPath)

  await waitForRunnersReadyness(config)

  if (afterSetupSleep > 0) {
    await sleepForX('After setup sleep', afterSetupSleep)
  }

  if (!!debug) {
    globalLogger.info(`Debug mode enabled, containers are kept running and Jest will not run.`)

    config.runners.forEach((runner, index) =>
      globalLogger.info(
        `[${index} | ${runner.runnerConfig.service}] ${JSON.stringify(
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

  for (const runner of config.runners) {
    await teardownSingle(runner)
  }

  globalLogger.perf(perfStart)
  allTestsPassed ? process.exit(0) : process.exit(1)
}

export default onRun
