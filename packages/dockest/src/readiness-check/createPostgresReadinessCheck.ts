import { withRetry } from './withRetry'
import { withNoStop } from './withNoStop'
import { Runner, ReadinessCheck } from '../@types'
import { execaWrapper } from '../utils/execaWrapper'

type Config = {
  POSTGRES_DB: string
  POSTGRES_USER: string
}

type MaybePromise<T> = T | Promise<T>

type ConfigMapper = Config | ((dockerComposeFileService: Runner) => MaybePromise<Config>)

const postgresReadinessCheck = (configMapper: ConfigMapper): ReadinessCheck => async args => {
  const config = await (typeof configMapper === 'function' ? configMapper(args.runner) : configMapper)
  // Ref: http://postgresguide.com/utilities/psql.html
  const command = `docker exec ${args.runner.containerId} bash -c " \
                        psql \
                        -h localhost \
                        -d ${config.POSTGRES_DB} \
                        -U ${config.POSTGRES_USER} \
                        -c 'select 1'"`

  await execaWrapper(command, { runner: args.runner })
}

export const createPostgresReadinessCheck = (configMapper: ConfigMapper, retryCount = 30): ReadinessCheck =>
  withNoStop(withRetry(postgresReadinessCheck(configMapper), { retryCount }))
