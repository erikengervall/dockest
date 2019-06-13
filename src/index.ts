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
    this.createComposeFileAndRun()

    await this.setupRunners()

    if (Dockest.config.dev.idling) {
      // For testing the docker file
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
      version: '2',
      services: {},
    }

    for (const runnerKey of Object.keys(runners)) {
      const runner = runners[runnerKey]

      const composeServiceFromRunner = runner.execOpts.commandCreators.createComposeService(
        runner.runnerConfig
      )

      composeFile = {
        ...composeFile,

        services: {
          ...composeFile.services,
          ...composeServiceFromRunner,
        },
      }
    }

    // console.log('***', JSON.stringify(composeFile, null, 2))
    const yml = yaml.safeDump(composeFile)

    fs.writeFile(`${__dirname}/composeFiles/docker-compose-generated.yml`, yml, err => {
      if (err) {
        throw new Error(`Something went horribly wrong: ${err.message}`)
      }
    })

    execa(`\ 
      docker-compose \
      -f ${__dirname}/composeFiles/docker-compose-generated.yml \
      up \
      --no-recreate \
      --detach \
    `)

    sleep(500)
  }

  private setupRunners = async () => {
    const { runners } = Dockest.config

    for (const runnerKey of Object.keys(runners)) {
      await runners[runnerKey].setup(runnerKey)
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
