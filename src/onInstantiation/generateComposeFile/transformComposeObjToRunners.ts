import { RedisRunner, PostgresRunner, GeneralPurposeRunner } from '../../runners'
import { DockestConfig } from '../../index'
import { ObjStrStr } from '../../@types'
import { ComposeFile } from '../../runners/@types'
import ConfigurationError from '../../errors/ConfigurationError'

const { keys } = Object

const REDIS_REG_EXP = RegExp('redis')
const POSTGRES_REG_EXP = RegExp('postgres')

export default (config: DockestConfig, composeObj: ComposeFile) =>
  keys(composeObj.services).map(service => {
    const attachedRunnerExist = config.runners.find(runner => runner.runnerConfig.service === service)
    if (attachedRunnerExist) {
      return attachedRunnerExist
    }

    const composeService = composeObj.services[service]

    if (REDIS_REG_EXP.test(composeService.image || '') || REDIS_REG_EXP.test(service)) {
      return new RedisRunner({
        service,
        image: composeService.image,
        ports: composeService.ports.reduce((acc: ObjStrStr, curr: string) => {
          const [host, container] = curr.split(':')
          acc[host] = container
          return acc
        }, {}),
      })
    }

    if (POSTGRES_REG_EXP.test(composeService.image || '') || POSTGRES_REG_EXP.test(service)) {
      if (!composeService.environment) {
        throw new ConfigurationError(`${service}: Invalid environment`)
      }

      return new PostgresRunner({
        service,
        image: composeService.image,
        ports: composeService.ports.reduce((acc: ObjStrStr, curr: string) => {
          const [host, container] = curr.split(':')
          acc[host] = container
          return acc
        }, {}),
        database: `${composeService.environment[PostgresRunner.ENVIRONMENT_DATABASE]}`,
        password: `${composeService.environment[PostgresRunner.ENVIRONMENT_PASSWORD]}`,
        username: `${composeService.environment[PostgresRunner.ENVIRONMENT_USERNAME]}`,
      })
    }

    return new GeneralPurposeRunner({
      service,
      image: composeService.image,
    })
  })
