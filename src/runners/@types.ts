import KafkaRunner, { KafkaRunnerConfig } from './KafkaRunner'
import PostgresRunner, { PostgresRunnerConfig } from './PostgresRunner'
import RedisRunner, { RedisRunnerConfig } from './RedisRunner'
import ZooKeeperRunner, { ZooKeeperRunnerConfig } from './ZooKeeperRunner'

export type Runner = KafkaRunner | PostgresRunner | RedisRunner | ZooKeeperRunner

export type RunnerConfig = KafkaRunnerConfig | PostgresRunnerConfig | RedisRunnerConfig | ZooKeeperRunnerConfig

export interface ComposeFile {
  depends_on?: string[]
  environment?: {
    [key: string]: string | number
  }
  image: string
  ports: string[]
}

export type GetComposeService = (composeFileName: string) => { [key: string]: ComposeFile }

export interface BaseRunner {
  getComposeService: GetComposeService
}
