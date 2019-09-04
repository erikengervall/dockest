import KafkaRunner, { KafkaRunnerConfig } from './KafkaRunner'
import PostgresRunner, { PostgresRunnerConfig } from './PostgresRunner'
import RedisRunner, { RedisRunnerConfig } from './RedisRunner'
import ZooKeeperRunner, { ZooKeeperRunnerConfig } from './ZooKeeperRunner'
import GeneralPurposeRunner, { GeneralPurposeConfig } from './GeneralPurposeRunner'
import { ObjStrStr } from '../@types'
import Logger from '../Logger'

export type Runner = KafkaRunner | PostgresRunner | RedisRunner | ZooKeeperRunner | GeneralPurposeRunner

export type RunnerConfig =
  | KafkaRunnerConfig
  | PostgresRunnerConfig
  | RedisRunnerConfig
  | ZooKeeperRunnerConfig
  | GeneralPurposeConfig

export interface ComposeFile {
  depends_on?: string[]
  image?: string
  environment?: {
    [key: string]: string | number
  }
  props?: {
    [key: string]: string | number
  }
  ports: string[]
}

export type GetComposeService = (
  composeFileName: string,
) => {
  [key: string]: ComposeFile
}

export interface BaseRunner {
  getComposeService: GetComposeService
  containerId: string
  initializer: string
  runnerConfig: RunnerConfig
  logger: Logger
}

export interface SharedRequiredConfigProps {
  service: string
}

export interface SharedDefaultableConfigProps {
  commands: string[]
  connectionTimeout: number
  dependsOn: Runner[]
  host: string
  image: string | undefined | null
  ports: ObjStrStr
  environment: { [key: string]: string | number }
  props: { [key: string]: string | number }
}
