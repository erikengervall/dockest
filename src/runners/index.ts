import { ExecOpts } from './BaseRunner'
import KafkaRunner, { KafkaRunnerConfig } from './KafkaRunner'
import PostgresRunner, { PostgresRunnerConfig } from './PostgresRunner'
import RedisRunner, { RedisRunnerConfig } from './RedisRunner'
import ZookeeperRunner, { ZookeeperRunnerConfig } from './ZookeeperRunner'

const runners = { KafkaRunner, PostgresRunner, RedisRunner, ZookeeperRunner }
export { runners }

export interface UserRunners {
  /**
   * `runnerKey` is a user-provided identifier for a runner instance
   * it's relevant since a user can instantiate multiple runners of the same type
   */
  [runnerKey: string]: PostgresRunner // | KafkaRunner | ZookeeperRunner
}

type RunnerConfigs =
  | KafkaRunnerConfig
  | PostgresRunnerConfig
  | RedisRunnerConfig
  | ZookeeperRunnerConfig

export { RunnerConfigs, ExecOpts }
