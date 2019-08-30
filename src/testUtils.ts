import { createMockProxy } from 'jest-mock-proxy'
import execa from 'execa' // eslint-disable-line import/default
import { ZooKeeperRunner, KafkaRunner, PostgresRunner, RedisRunner, SimpleRunner } from './runners'
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

const createDockestConfig = (opts: { runners?: Runner[] }) => {
  const { runners = [] } = opts

  for (const runner of runners) {
    runner.logger = createMockProxy()
  }

  return {
    runners,
    opts: DEFAULT_USER_CONFIG,
    jest: {},
    $: INTERNAL_CONFIG,
  }
}

export default ({ withRunnerCommands = false }) => {
  const withCmds = withRunnerCommands ? { commands: [runnerCommand] } : {}

  const zooKeeperRunner = new ZooKeeperRunner({ service: 'zookeepeer', ...withCmds })
  const kafkaRunner = new KafkaRunner({ service: 'kafka', dependsOn: [zooKeeperRunner], ...withCmds })
  const postgresRunner = new PostgresRunner({
    service: 'postgres',
    database: '_',
    username: '_',
    password: '_',
    ...withCmds,
  })
  const redisRunner = new RedisRunner({ service: 'redis', ...withCmds })
  const simpleRunner = new SimpleRunner({ service: 'simple', ...withCmds })
  const initializedRunners = { kafkaRunner, postgresRunner, redisRunner, zooKeeperRunner, simpleRunner }

  beforeEach(() => values(initializedRunners).forEach(runner => (runner.logger = createMockProxy())))

  return {
    initializedRunners,
    runners: {
      ZooKeeperRunner,
      KafkaRunner,
      PostgresRunner,
      RedisRunner,
      SimpleRunner,
    },
    execa,
    Logger,
    createDockestConfig,
  }
}
