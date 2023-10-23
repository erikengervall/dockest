import { withNoStop } from './withNoStop'
import { withRetry } from './withRetry'
import { ReadinessCheck, Runner } from '../@types'
import { execaWrapper } from '../utils/execa-wrapper'

type Config = {
  POSTGRES_DB: string
  POSTGRES_USER: string
  POSTGRES_PASSWORD?: string
}

type MaybePromise<T> = T | Promise<T>

type ConfigMapper = Config | ((dockerComposeFileService: Runner) => MaybePromise<Config>)

const defaultConfigMapper: ConfigMapper = runner => runner.dockerComposeFileService.environment

const postgresReadinessCheck = (configMapper: ConfigMapper): ReadinessCheck => async args => {
  const config = await (typeof configMapper === 'function' ? configMapper(args.runner) : configMapper)

  if (!config?.POSTGRES_DB) {
    throw new Error("Value 'POSTGRES_DB' was not provided.")
  }
  if (!config?.POSTGRES_USER) {
    throw new Error("Value 'POSTGRES_USER' was not provided.")
  }

  const passwordEnvironmentVariable = config?.POSTGRES_PASSWORD ? `PGPASSWORD='${config.POSTGRES_PASSWORD}'` : ''
  // Ref: http://postgresguide.com/utilities/psql.html
  const command = `docker exec ${args.runner.containerId} bash -c " \
                      ${passwordEnvironmentVariable} psql \
                      -h localhost \
                      -d ${config.POSTGRES_DB} \
                      -U ${config.POSTGRES_USER} \
                      -c 'select 1'"`

  await execaWrapper(command, { runner: args.runner })
}

export const createPostgresReadinessCheck = (args?: { config?: ConfigMapper; retryCount?: number }): ReadinessCheck =>
  withNoStop(
    withRetry(postgresReadinessCheck(args?.config ?? defaultConfigMapper), {
      retryCount: args?.retryCount ?? 30,
    }),
  )
