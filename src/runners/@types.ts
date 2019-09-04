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

export type Service = string
export type Commands = string[]
export type ConnectionTimeout = number
export type DependsOn = Runner[]
export type Host = string
export type Image = string | undefined
export type Ports = ObjStrStr
export interface Props {
  environment?: {
    [key: string]: string | number
  }
  build?: string
  [key: string]: any
}

export interface ComposeFile {
  depends_on?: string[]
  image?: string
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
  service: Service
}

export interface SharedDefaultableConfigProps {
  commands: Commands
  connectionTimeout: ConnectionTimeout
  dependsOn: DependsOn
  host: Host
  image: Image
  ports: Ports
  props: Props
}
