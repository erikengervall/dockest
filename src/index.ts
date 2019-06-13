import fs from 'fs'
import yaml from 'js-yaml'
import { LOG_LEVEL } from './constants'
import { ConfigurationError } from './errors'
import setupExitHandler, { ErrorPayload } from './exitHandler'
import JestRunner, { JestConfig } from './jest'
import { BaseLogger } from './loggers'
import { KafkaRunner, PostgresRunner, RedisRunner, ZooKeeperRunner } from './runners'
import { execa, sleep, sleepWithLog, validateTypes } from './runners/utils'

interface UserRunners {
  [runnerKey: string]: KafkaRunner | PostgresRunner | RedisRunner
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

const DEFAULT_CONFIG: DefaultableConfigProps = {
  afterSetupSleep: 0,
  exitHandler: null,
  logLevel: LOG_LEVEL.NORMAL,
  dockerComposeFileName: 'docker-compose.yml',
  dev: {},
}

class Dockest {
  public static jestRanWithResult: boolean = false
  public static config: DockestConfig
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
    await this.runTimeSetup()

    if (Dockest.config.dev.idling) {
      // Will keep the docker containers running
      // Useful for testing
      return
    }

    if (Dockest.config.afterSetupSleep > 0) {
      await sleepWithLog('After setup sleep progress', Dockest.config.afterSetupSleep)
    }

    const result = await this.runJest()
    await this.teardownRunners()
    result.success ? process.exit(0) : process.exit(1)
  }

  private createComposeFileAndRun = () => {
    const { runners } = Dockest.config

    let composeFile = {
      version: '3',
      services: {},
    }

    for (const runnerKey of Object.keys(runners)) {
      const runner = runners[runnerKey]

      const composeServiceFromRunner = runner.execOpts.runnerCommandFactories.getComposeService(
        runner.runnerConfig,
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

    const dockerComposeGeneratedPath = `${__dirname}/docker-compose-generated.yml`

    fs.writeFile(`${dockerComposeGeneratedPath}`, yml, err => {
      if (err) {
        throw new Error(`Something went horribly wrong: ${err.message}`)
      }
    })

    execa(`\
      docker-compose \
      -f ${dockerComposeGeneratedPath} \
      up \
      --no-recreate \
      --detach \
      `)

    sleep(500)
  }

  private runTimeSetup = async () => {
    this.createComposeFileAndRun()

    const { runners } = Dockest.config

    for (const runnerKey of Object.keys(runners)) {
      await runners[runnerKey].runTimeSetup(runnerKey)
    }
  }

  private runJest = async () => {
    const result = await this.jestRunner.run()
    Dockest.jestRanWithResult = true

    return result
  }

  private teardownRunners = async () => {
    const { runners } = Dockest.config

    for (const runnerKey of Object.keys(runners)) {
      await runners[runnerKey].teardown()
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
