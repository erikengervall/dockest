import DockestConfig from '../DockestConfig'
import DockestLogger from '../DockestLogger'
import createHelpers, { IHelpers } from './helpers'
import createKafka, { IKafka } from './kafka'
import createPostgres, { IPostgres } from './postgres'
import createRedis, { IRedis } from './redis'
import createTeardown, { ITeardown } from './teardown'

export class DockestExecs {
  postgres: IPostgres
  redis: IRedis
  kafka: IKafka
  teardown: ITeardown
  helpers: IHelpers

  constructor(Config: DockestConfig, Logger: DockestLogger) {
    this.postgres = createPostgres(Config, Logger)
    this.redis = createRedis(Logger)
    this.kafka = createKafka(Logger)
    this.teardown = createTeardown(Config, Logger)
    this.helpers = createHelpers(Logger)
  }
}

export default DockestExecs
