import { IResources } from '../'
import jestRunner from './jest'
import kafkaRunner from './kafka'
import postgresRunner from './postgres'
import redisRunner from './redis'

export type all = () => Promise<void>

export interface IRunner {
  all: all;
}

const Runner = (resources: IResources): IRunner => {
  const { Config, Logger } = resources

  const all: all = async () => {
    Logger.loading('Integration test initiated')

    const config = Config.getConfig()
    const { postgres: postgresConfigs, redis: redisConfigs, kafka: kafkaConfigs } = config

    for (const postgresConfig of postgresConfigs) {
      await postgresRunner(postgresConfig, resources)
    }

    for (const redisConfig of redisConfigs) {
      await redisRunner(redisConfig, resources)
    }

    for (const kafkaConfig of kafkaConfigs) {
      await kafkaRunner(kafkaConfig, resources)
    }

    Logger.success('Dependencies up and running, ready for Jest unit tests')

    await jestRunner(resources)
  }

  return {
    all,
  }
}

export default Runner
