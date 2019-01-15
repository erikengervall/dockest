import execa from 'execa'
import DockestLogger from '../DockestLogger'
import { IPostgresRunnerConfig } from '../runners/postgres'

type getContainerId = (postgresConfig: IPostgresRunnerConfig) => Promise<string>
type runCustomCommand = (command: string) => Promise<void>

export interface IHelpers {
  getContainerId: getContainerId
  runCustomCommand: runCustomCommand
}

const logger = new DockestLogger()

const getContainerId: getContainerId = async ({ label }) => {
  const { stdout } = await execa.shell(
    `docker ps --filter "status=running" --filter "label=${label}" --no-trunc -q`
  )
  const containerId = stdout.replace(/\r?\n|\r/g, '')

  return containerId
}

export const runCustomCommand: runCustomCommand = async command => {
  logger.loading(`Running custom command: ${command}`)

  const { stdout: result = '' } = await execa.shell(command)

  logger.success(
    `Successfully ran custom command: ${
      typeof result === 'object' ? JSON.stringify(result) : result
    }`
  )
}
