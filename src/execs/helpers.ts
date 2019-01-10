import execa from 'execa'
import { IPostgresConfig$Int } from '../DockestConfig'
import { DockestLogger } from '../DockestLogger'

type getContainerId = (postgresConfig: IPostgresConfig$Int) => Promise<string>
type runCustomCommand = (command: string) => Promise<void>

export interface IHelpers {
  getContainerId: getContainerId;
  runCustomCommand: runCustomCommand;
}

const createHelpers = (Logger: DockestLogger): IHelpers => {
  const getContainerId: getContainerId = async postgresConfig => {
    const { stdout } = await execa.shell(
      `docker ps --filter "status=running" --filter "label=${postgresConfig.label}" --no-trunc -q`
    )
    const containerId = stdout.replace(/\r?\n|\r/g, '')

    return containerId
  }

  const runCustomCommand: runCustomCommand = async command => {
    Logger.loading(`Running custom command: ${command}`)

    const { stdout: result = '' } = await execa.shell(command)

    Logger.success(
      `Successfully ran custom command: ${
        typeof result === 'object' ? JSON.stringify(result) : result
      }`
    )
  }

  return {
    getContainerId,
    runCustomCommand,
  }
}

export default createHelpers
