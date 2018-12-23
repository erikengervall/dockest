import execa from 'execa'
import { IPostgresConfig$Int } from '../DockestConfig'
import { DockestLogger } from '../DockestLogger'

type getContainerId = (postgresConfig: IPostgresConfig$Int) => Promise<string>
type customCmd = (cmd: string) => Promise<string>

export interface IHelpers {
  getContainerId: getContainerId;
  customCmd: customCmd;
}

const createHelpers = (Logger: DockestLogger): IHelpers => {
  const getContainerId: getContainerId = async postgresConfig => {
    const { stdout } = await execa.shell(
      `docker ps --filter "status=running" --filter "label=${postgresConfig.label}" --no-trunc -q`
    )
    const containerId = stdout.replace(/\r?\n|\r/g, '')

    return containerId
  }

  const customCmd: customCmd = async cmd => {
    Logger.loading(`Running custom command: ${cmd}`)

    const { stdout } = await execa.shell(cmd)

    Logger.success(`Successfully ran custom command with result:`, {
      result: stdout,
    })

    return stdout
  }

  return {
    getContainerId,
    customCmd,
  }
}

export default createHelpers
