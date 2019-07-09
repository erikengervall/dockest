import { DockestConfig } from '../'

const flattenRunners = (config: DockestConfig) => {
  for (const runner of config.runners) {
    config.runners = config.runners.concat(runner.runnerConfig.dependsOn)
  }
}

export default flattenRunners
