import KafkaRunner, { KafkaRunnerConfig } from './KafkaRunner'
import PostgresRunner, { PostgresRunnerConfig } from './PostgresRunner'
import RedisRunner, { RedisRunnerConfig } from './RedisRunner'

export { ExecOpts } from './BaseRunner'
export type RunnerConfigs = KafkaRunnerConfig | PostgresRunnerConfig | RedisRunnerConfig
export { KafkaRunner, PostgresRunner, RedisRunner }
