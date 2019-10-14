import { RedisRunner, PostgresRunner, GeneralPurposeRunner, ZooKeeperRunner, KafkaRunner } from '../../runners'
import { DockestConfig } from '../../index'
import { ComposeFile } from '../../runners/@types'
import ConfigurationError from '../../errors/ConfigurationError'

const { keys } = Object

const REDIS_REG_EXP = RegExp('redis')
const POSTGRES_REG_EXP = RegExp('postgres')
const ZOOKEEPER_REG_EXP = RegExp('zookeeper')
const KAFKA_REG_EXP = RegExp('kafka')

export default (config: DockestConfig, composeObj: ComposeFile) =>
  keys(composeObj.services).map(service => {
    const attachedRunnerExist = config.runners.find(runner => runner.runnerConfig.service === service)
    if (attachedRunnerExist) {
      return attachedRunnerExist
    }

    const composeService = composeObj.services[service]

    /**
     * Redis
     */
    if (REDIS_REG_EXP.test(composeService.image || '') || REDIS_REG_EXP.test(service)) {
      return new RedisRunner({
        service,
        image: composeService.image,
        ports: composeService.ports,
        props: composeService.environment,
      })
    }

    /**
     * Postgres
     */
    if (POSTGRES_REG_EXP.test(composeService.image || '') || POSTGRES_REG_EXP.test(service)) {
      if (!composeService.environment) {
        throw new ConfigurationError(`${service}: Invalid environment`)
      }

      return new PostgresRunner({
        service,
        image: composeService.image,
        ports: composeService.ports,
        props: composeService.environment,
        database: `${composeService.environment[PostgresRunner.ENVIRONMENT_DATABASE]}`,
        password: `${composeService.environment[PostgresRunner.ENVIRONMENT_PASSWORD]}`,
        username: `${composeService.environment[PostgresRunner.ENVIRONMENT_USERNAME]}`,
      })
    }

    /**
     * ZooKeeper
     */
    if (ZOOKEEPER_REG_EXP.test(composeService.image || '') || ZOOKEEPER_REG_EXP.test(service)) {
      if (!composeService.environment) {
        throw new ConfigurationError(`${service}: Invalid environment`)
      }

      return new ZooKeeperRunner({
        service,
        image: composeService.image,
        ports: composeService.ports,
        props: composeService.environment,
      })
    }

    /**
     * Kafka
     */
    if (KAFKA_REG_EXP.test(composeService.image || '') || KAFKA_REG_EXP.test(service)) {
      if (!composeService.environment) {
        throw new ConfigurationError(`${service}: Invalid environment`)
      }

      return new KafkaRunner({
        service,
        image: composeService.image,
        ports: composeService.ports,
        props: composeService.environment,
      })
    }

    return new GeneralPurposeRunner({
      service,
      image: composeService.image,
    })
  })
