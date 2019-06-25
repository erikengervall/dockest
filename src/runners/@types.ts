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
  image: string
  depends_on?: object
  port?: string
  ports: string[]
  environment?: {
    [key: string]: string | number
  }
}

export type GetComposeService = (dockerComposeFileName: string) => { [key: string]: ComposeFile }
