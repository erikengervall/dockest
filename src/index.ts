import fs from 'fs'
import yaml from 'js-yaml'
import { LOG_LEVEL } from './constants'
import { ConfigurationError, DockestError } from './errors'
import setupExitHandler, { ErrorPayload } from './exitHandler'
import JestRunner, { JestConfig } from './jest'
import { BaseLogger } from './loggers'
import { KafkaRunner, PostgresRunner, RedisRunner, ZooKeeperRunner } from './runners'
import createSetupHelpers from './runners/createSetupHelpers'
import { execa, sleep, sleepWithLog, teardownSingle, validateTypes } from './runners/utils'

interface UserRunners {
  [runnerKey: string]: PostgresRunner | RedisRunner | KafkaRunner | ZooKeeperRunner
}

interface RequiredConfigProps {
  jest: JestConfig
  runners: UserRunners
}
interface DefaultableConfigProps {
  afterSetupSleep: number
  exitHandler: null | ((error: ErrorPayload) => any)
  logLevel: number
  dockerComposeFileName: string
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
    const { runners } = Dockest.config

    this.generateComposeFile(runners)
    this.runDockerComposeUp()

    await this.sequentialRunnerSetup(runners)

    if (Dockest.config.dev.idling) {
      // Will keep the docker containers running indefinitely
      return
    }

    if (Dockest.config.afterSetupSleep > 0) {
      await sleepWithLog('After setup sleep progress', Dockest.config.afterSetupSleep)
    }

    const result = await this.runJest()

    await this.teardownRunners(runners)

    result.success ? process.exit(0) : process.exit(1)
  }

  private sequentialRunnerSetup = async (runners: UserRunners) => {
    for (const runnerKey of Object.keys(runners)) {
      const runner = runners[runnerKey]
      const {
        setupStarted,
        getRunTimeParameters,
        performHealthchecks,
        runCustomCommands,
        setupCompleted,
      } = createSetupHelpers(runner, runnerKey)

      setupStarted()
      await getRunTimeParameters()
      await performHealthchecks()
      await runCustomCommands()
      setupCompleted()
    }
  }

  private generateComposeFile = (runners: UserRunners) => {
    let composeFile = {
      version: '3',
      services: {},
    }

    for (const runnerKey of Object.keys(runners)) {
      const runner = runners[runnerKey]

      const composeServiceFromRunner = runner.runnerMethods.getComposeService(
        Dockest.config.dockerComposeFileName
      )

      composeFile = {
        ...composeFile,

        services: {
          ...composeFile.services,
          ...composeServiceFromRunner,
        },
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

  private runDockerComposeUp = () => {
    execa(` \
          docker-compose \
          -f ${DOCKER_COMPOSE_GENERATED_PATH} \
          up \
          --no-recreate \
          --detach \
        `)

    sleep(100)
  }

  private runJest = async () => {
    const result = await this.jestRunner.run()
    Dockest.jestRanWithResult = true

    return result
  }

  private teardownRunners = async (runners: UserRunners) => {
    for (const runnerKey of Object.keys(runners)) {
      const runner = runners[runnerKey]
      const { containerId } = runner

      await teardownSingle(containerId, runnerKey)
    }
  }

  private validateConfig = () => {
    const schema: { [key in keyof RequiredConfigProps]: any } = {
      jest: validateTypes.isObject,
      runners: validateTypes.isObject,
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
