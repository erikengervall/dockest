import fs from 'fs'
import yaml from 'js-yaml'
import { LOG_LEVEL } from './constants'
import { ConfigurationError, DockestError } from './errors'
import setupExitHandler, { ErrorPayload } from './exitHandler'
import JestRunner, { JestConfig } from './jest'
import { BaseLogger, globalLogger } from './loggers'
import {
  ComposeFile,
  KafkaRunner,
  PostgresRunner,
  RedisRunner,
  Runner,
  ZooKeeperRunner,
} from './runners'
import {
  checkConnection,
  checkResponsiveness,
  execa,
  resolveContainerId,
  runRunnerCommands,
  sleep,
  sleepWithLog,
  teardownSingle,
  validateTypes,
} from './utils'

interface RequiredConfigProps {
  jest: JestConfig
  runners: Runner[]
}
interface DefaultableConfigProps {
  afterSetupSleep: number
  exitHandler: null | ((error: ErrorPayload) => any)
  logLevel: number
  dockerComposeFileName: string
  // runInBand: boolean // TODO: This'll be possible once logging is seperated between the runners
  dev: {
    idling?: boolean
  }
}
type DockestConfigUserInput = RequiredConfigProps & Partial<DefaultableConfigProps>
export type DockestConfig = RequiredConfigProps & DefaultableConfigProps

const DOCKER_COMPOSE_GENERATED_PATH = `${__dirname}/docker-compose-generated.yml`
const DEFAULT_CONFIG: DefaultableConfigProps = {
  afterSetupSleep: 0,
  exitHandler: null,
  logLevel: LOG_LEVEL.NORMAL,
  dockerComposeFileName: 'docker-compose.yml',
  dev: {
    idling: false,
  },
}

class Dockest {
  public static jestRanWithResult: boolean = false
  public static config: DockestConfig
  public static logLevel: number
  private static instance: Dockest
  private jestRunner: JestRunner

  constructor(userConfig: DockestConfigUserInput) {
    Dockest.config = {
      ...DEFAULT_CONFIG,
      ...userConfig,
    }
    BaseLogger.logLevel = Dockest.config.logLevel
    this.jestRunner = new JestRunner(Dockest.config.jest)

    this.validateConfig()
    setupExitHandler(Dockest.config)

    return Dockest.instance || (Dockest.instance = this)
  }

  public run = async (): Promise<void> => {
    this.flattenRunners()
    this.generateComposeFile()
    this.dockerComposeUp()
    await this.sequentialRunnerSetup()

    if (Dockest.config.dev.idling) {
      globalLogger.info(`Dev mode enabled: Jest will not run.`)
      return // Will keep the docker containers running indefinitely
    }

    if (Dockest.config.afterSetupSleep > 0) {
      await sleepWithLog('After setup sleep progress', Dockest.config.afterSetupSleep)
    }

    const result = await this.runJest()
    await this.teardownRunners()
    result.success ? process.exit(0) : process.exit(1)
  }

  private flattenRunners = () => {
    for (const runner of Dockest.config.runners) {
      Dockest.config.runners.concat(runner.runnerConfig.dependsOn)
    }
  }

  private generateComposeFile = () => {
    const composeFile = {
      version: '3',
      services: {},
    }

    for (const runner of Dockest.config.runners) {
      const {
        runnerConfig: { dependsOn },
        getComposeService,
      } = runner
      const service = getComposeService(Dockest.config.dockerComposeFileName)

      const depServices = dependsOn.reduce(
        (acc: { [key: string]: ComposeFile }, runner: Runner) => {
          const {
            runnerConfig: { service },
            getComposeService,
          } = runner
          acc[service] = getComposeService(Dockest.config.dockerComposeFileName)[service]

          return acc
        },
        {}
      )

      composeFile.services = {
        ...composeFile.services,
        ...service,
        ...depServices,
      }
    }

    const yml = yaml.safeDump(composeFile)

    try {
      fs.writeFileSync(`${DOCKER_COMPOSE_GENERATED_PATH}`, yml)
    } catch (error) {
      throw new DockestError(
        `Something went wrong when generating the docker-compose file: ${error.message}`
      )
    }
  }

  private dockerComposeUp = () => {
    execa(` \
          docker-compose \
          -f ${DOCKER_COMPOSE_GENERATED_PATH} \
          up \
          --no-recreate \
          --detach \
        `)

    sleep(100)
  }

  private sequentialRunnerSetup = async () => {
    for (const runner of Dockest.config.runners) {
      // Set initial values
      runner.runnerLogger.runnerSetup()

      // Get containerId
      await resolveContainerId(runner)

      // Healthchecks
      await checkConnection(runner)
      await checkResponsiveness(runner)

      // Run custom runner commands
      await runRunnerCommands(runner)

      // Round up
      runner.runnerLogger.runnerSetupSuccess()
    }
  }

  private runJest = async () => {
    const result = await this.jestRunner.run()
    Dockest.jestRanWithResult = true

    return result
  }

  private teardownRunners = async () => {
    for (const runner of Dockest.config.runners) {
      await teardownSingle(runner)
    }
  }

  private validateConfig = () => {
    const schema: { [key in keyof RequiredConfigProps]: any } = {
      jest: validateTypes.isObject,
      runners: validateTypes.isArray,
    }

    const failures = validateTypes(schema, Dockest.config)

    if (failures.length > 0) {
      throw new ConfigurationError(`${failures.join('\n')}`)
    }
  }
}

const logLevel = LOG_LEVEL
const runners = { KafkaRunner, PostgresRunner, RedisRunner, ZooKeeperRunner }
export { logLevel, execa, runners }
export default Dockest
