import { createMockProxy } from 'jest-mock-proxy'
import execa from 'execa' // eslint-disable-line import/default
import { ZooKeeperRunner, KafkaRunner, PostgresRunner, RedisRunner, GeneralPurposeRunner } from './runners'
import { Runner } from './runners/@types'
import Logger from './Logger'
import { DEFAULT_USER_CONFIG, INTERNAL_CONFIG } from './constants'

export const mockedExecaStdout = 'getContainerId 🌮'
export const runnerCommand = 'runRunnerCommands 🌮'

/**
 * FIXME: Would love for this to work 🦊
 */
// jest.mock('execa', () => jest.fn(() => ({ stdout: mockedExecaStdout })))
// jest.mock('./Logger')

const { values } = Object

const createDockestConfig = (options: { runners?: Runner[]; opts?: any; realLoggers?: boolean }) => {
  const { runners = [], opts = {}, realLoggers = false } = options

  if (realLoggers === false) {
    for (const runner of runners) {
      runner.logger = createMockProxy()
    }
  }

  return {
    runners,
    opts: { ...DEFAULT_USER_CONFIG, ...opts },
    jest: {},
    $: INTERNAL_CONFIG,
  }
}

export default ({ withRunnerCommands = false, realLoggers = false }) => {
  const withCmds = withRunnerCommands ? { commands: [runnerCommand] } : {}

  const zooKeeperRunner = new ZooKeeperRunner({
    service: 'zookeeper',
    image: 'zookeeper/image:123',
    ...withCmds,
  })
  const kafkaRunner = new KafkaRunner({
    service: 'kafka',
    image: 'kafka/image:123',
    dependsOn: [zooKeeperRunner],
    ...withCmds,
  })
  const postgresRunner = new PostgresRunner({
    service: 'postgres',
    image: 'postgres/image:123',
    database: '_',
    username: '_',
    password: '_',
    ...withCmds,
  })
  const redisRunner = new RedisRunner({
    service: 'redis',
    image: 'redis/image:123',
    ...withCmds,
  })
  const generalPurposeRunner = new GeneralPurposeRunner({
    service: 'general',
    image: 'general/image:123',
    ...withCmds,
  })
  const initializedRunners = {
    kafkaRunner,
    postgresRunner,
    redisRunner,
    zooKeeperRunner,
    generalPurposeRunner,
  }

  beforeEach(() => {
    if (realLoggers === false) {
      values(initializedRunners).forEach(runner => (runner.logger = createMockProxy()))
    }
  })

  return {
    initializedRunners,
    runners: {
      ZooKeeperRunner,
      KafkaRunner,
      PostgresRunner,
      RedisRunner,
      GeneralPurposeRunner,
    },
    execa,
    Logger,
    createDockestConfig,
  }
}
