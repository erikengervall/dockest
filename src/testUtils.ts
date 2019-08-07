import { createMockProxy } from 'jest-mock-proxy'
import execa from 'execa'

import { KafkaRunner, PostgresRunner, RedisRunner, ZooKeeperRunner } from './runners'
import { Runner } from './runners/@types'
import Logger from './Logger'

export const mockedExecaStdout = 'getContainerId 🌮'
export const runnerCommand = 'runRunnerCommands 🌮'

jest.mock('execa', () => jest.fn(() => ({ stdout: mockedExecaStdout })))
jest.mock('./Logger')

type testUtils = (opts: {
  withRunnerCommands?: boolean
}) => {
  allRunners: Runner[]
  execa: any
  kafkaRunner: Runner
  Logger: any
  postgresRunner: Runner
  redisRunner: Runner
  runnerCommands?: string[]
  zooKeeperRunner: Runner
}

const testUtils: testUtils = ({ withRunnerCommands }) => {
  const withCmds = withRunnerCommands ? { commands: [runnerCommand] } : {}

  const zooKeeperRunner = new ZooKeeperRunner({
    service: 'zookeepeer',
    ...withCmds,
  })
  const kafkaRunner = new KafkaRunner({
    service: 'kafka',
    dependsOn: [zooKeeperRunner],
    ...withCmds,
  })
  const postgresRunner = new PostgresRunner({
    service: 'postgres',
    database: '_',
    username: '_',
    password: '_',
    ...withCmds,
  })
  const redisRunner = new RedisRunner({
    service: 'redis',
    ...withCmds,
  })

  beforeEach(() => {
    kafkaRunner.logger = createMockProxy()
    postgresRunner.logger = createMockProxy()
    redisRunner.logger = createMockProxy()
    zooKeeperRunner.logger = createMockProxy()
  })

  return {
    allRunners: [kafkaRunner, postgresRunner, redisRunner, zooKeeperRunner],
    execa,
    kafkaRunner,
    Logger,
    postgresRunner,
    redisRunner,
    zooKeeperRunner,
  }
}

export default testUtils
