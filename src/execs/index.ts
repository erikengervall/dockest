import DockestConfig from '../DockestConfig'
import DockestLogger from '../DockestLogger'
import createHelpers, { IHelpers } from './helpers'
import createPostgres, { IPostgres } from './postgres'
import createTeardown, { ITeardown } from './teardown'

export class DockestExecs {
  postgres: IPostgres
  teardown: ITeardown
  helpers: IHelpers

  constructor(Config: DockestConfig, Logger: DockestLogger) {
    this.postgres = createPostgres(Config, Logger)
    this.teardown = createTeardown(Config, Logger)
    this.helpers = createHelpers(Logger)
  }
}

export default DockestExecs
