import { LOG_LEVEL } from './constants'
import { ConfigurationError } from './errors'
import setupExitHandler from './exitHandler'
import JestRunner, { JestConfig } from './jest'
import { BaseLogger } from './loggers'
import { KafkaRunner, PostgresRunner, RedisRunner, ZookeeperRunner } from './runners'
import { runCustomCommand, validateTypes } from './runners/utils'

interface UserRunners {
  [runnerKey: string]: KafkaRunner | PostgresRunner | RedisRunner | ZookeeperRunner
}

interface RequiredConfigProps {
  jest: JestConfig
  runners: UserRunners
}
interface DefaultableConfigProps {
  logLevel: number
  exitHandler: (_: any) => void
}
type DockestConfigUserInput = RequiredConfigProps & Partial<DefaultableConfigProps>
export type DockestConfig = RequiredConfigProps & DefaultableConfigProps

const DEFAULT_CONFIG: DefaultableConfigProps = {
  logLevel: LOG_LEVEL.NORMAL,
  exitHandler: (_: any) => undefined,
}

export default class Dockest {
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
    await this.setupRunners()
    const result = await this.runJest()
    await this.teardownRunners()

    result.success ? process.exit(0) : process.exit(1)
  }

  private setupRunners = async () => {
    const { runners } = Dockest.config

    await runCustomCommand('Dockest', 'docker-compose pull')

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
const runners = { KafkaRunner, PostgresRunner, RedisRunner, ZookeeperRunner }
export { logLevel, runners }
