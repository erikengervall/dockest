import KafkaRunner, { KafkaRunnerConfig } from './KafkaRunner'
import PostgresRunner, { PostgresRunnerConfig } from './PostgresRunner'
import RedisRunner, { RedisRunnerConfig } from './RedisRunner'
import ZooKeeperRunner, { ZooKeeperRunnerConfig } from './ZooKeeperRunner'
import SimpleRunner, { SimpleRunnerConfig } from './SimpleRunner'

export type Runner = KafkaRunner | PostgresRunner | RedisRunner | ZooKeeperRunner | SimpleRunner

export type RunnerConfig =
  | KafkaRunnerConfig
  | PostgresRunnerConfig
  | RedisRunnerConfig
  | ZooKeeperRunnerConfig
  | SimpleRunnerConfig

export interface ComposeFile {
  depends_on?: string[]
  environment?: { [key: string]: string | number }
  image: string
  ports: string[]
}

export type GetComposeService = (
  composeFileName: string,
) => {
  [key: string]: ComposeFile
}

export interface BaseRunner {
  getComposeService: GetComposeService
}

export interface SharedRequiredConfigProps {
  service: string
}

export interface SharedDefaultableConfigProps {} // eslint-disable-line @typescript-eslint/no-empty-interface
