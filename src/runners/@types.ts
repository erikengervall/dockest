import KafkaRunner, { KafkaRunnerConfig } from './KafkaRunner'
import PostgresRunner, { PostgresRunnerConfig } from './PostgresRunner'
import RedisRunner, { RedisRunnerConfig } from './RedisRunner'
import ZooKeeperRunner, { ZooKeeperRunnerConfig } from './ZooKeeperRunner'

export type Runner = KafkaRunner | PostgresRunner | RedisRunner | ZooKeeperRunner

export type RunnerConfig =
  | KafkaRunnerConfig
  | PostgresRunnerConfig
  | RedisRunnerConfig
  | ZooKeeperRunnerConfig

export type ComposeFile = {
  depends_on?: object
  environment?: { [key: string]: string | number }
  image: string
  port?: string
  ports: string[]
}

export type GetComposeService = (dockerComposeFileName: string) => { [key: string]: ComposeFile }
