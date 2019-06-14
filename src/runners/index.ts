import KafkaRunner, { KafkaRunnerConfig } from './KafkaRunner'
import PostgresRunner, { PostgresRunnerConfig } from './PostgresRunner'
import RedisRunner, { RedisRunnerConfig } from './RedisRunner'
import ZooKeeperRunner, { ZooKeeperRunnerConfig } from './ZooKeeperRunner'

export type RunnerConfig =
  | KafkaRunnerConfig
  | PostgresRunnerConfig
  | RedisRunnerConfig
  | ZooKeeperRunnerConfig
export type Runner = KafkaRunner | PostgresRunner | RedisRunner | ZooKeeperRunner

export { KafkaRunner, PostgresRunner, RedisRunner, ZooKeeperRunner }
