import execa from 'execa'
import { createMockProxy } from 'jest-mock-proxy'
import { KafkaRunner, PostgresRunner, RedisRunner, ZooKeeperRunner } from './runners'
import { Runner } from './runners/@types'

export const mockedExecaStdout = 'getContainerId 🌮'
export const runnerCommand = 'runRunnerCommands 🌮'

type testUtils = (opts: {
  withRunnerCommands?: boolean
}) => {
  allRunners: Runner[]
  execa: any
  kafkaRunner: Runner
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
    kafkaRunner.runnerLogger = createMockProxy()
    postgresRunner.runnerLogger = createMockProxy()
    redisRunner.runnerLogger = createMockProxy()
    zooKeeperRunner.runnerLogger = createMockProxy()
    // console.log({ execa })
    // execa.mockClear()
  })

  return {
    allRunners: [kafkaRunner, postgresRunner, redisRunner, zooKeeperRunner],
    execa,
    kafkaRunner,
    postgresRunner,
    redisRunner,
    zooKeeperRunner,
  }
}

export default testUtils
