import KafkaRunner from './KafkaRunner'
import PostgresRunner from './PostgresRunner'
import RedisRunner from './RedisRunner'
import ZookeeperRunner from './ZookeeperRunner'

export interface BaseRunner {
  /**
   * Start containers
   * Healthcheck containers
   */
  setup: (runnerKey: string) => Promise<void>
  /**
   * Teardown resources
   * Stop containers
   * Remove containers
   */
  teardown: () => Promise<void>
}

export interface Runners {
  /**
   * `runnerKey` is a user-provided identifier for a runner instance
   * it's relevant since a user can instantiate multiple runners of the same type
   */
  [runnerKey: string]: PostgresRunner | KafkaRunner | ZookeeperRunner
}

const runners = { KafkaRunner, PostgresRunner, RedisRunner, ZookeeperRunner }
export { runners }
