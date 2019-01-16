import execa from 'execa'
import DockestLogger from '../DockestLogger'
// import { IPostgresRunnerConfig } from '../runners/postgres'

const logger = new DockestLogger()

// Deprecated
// const getContainerId = async (runnerConfig: IPostgresRunnerConfig): Promise<string> => {
//   const { label } = runnerConfig
//   const { stdout } = await execa.shell(
//     `docker ps --filter "status=running" --filter "label=${label}" --no-trunc -q`
//   )
//   const containerId = stdout.replace(/\r?\n|\r/g, '')

//   return containerId
// }

const runCustomCommand = async (command: string): Promise<void> => {
  logger.loading(`Running custom command: ${command}`)

  const { stdout: result = '' } = await execa.shell(command)

  logger.success(
    `Successfully ran custom command: ${
      typeof result === 'object' ? JSON.stringify(result) : result
    }`
  )
}

export { runCustomCommand }
