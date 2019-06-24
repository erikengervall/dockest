import execa from 'execa'
import { PostgresRunner } from '../runners'
import runRunnerCommands from './runRunnerCommands'

const command = 'mockCommand'
const stdout = `mockStdout`
const postgresRunner = new PostgresRunner({
  service: '_',
  username: '_',
  password: '_',
  database: '_',
})

jest.mock('execa', () => ({
  shell: jest.fn(() => ({
    stdout,
  })),
}))

describe('runRunnerCommands', () => {
  it('trabajo', async () => {
    // @ts-ignore
    postgresRunner.runnerLogger = jest.fn()

    await runRunnerCommands(postgresRunner)

    expect(postgresRunner.runnerLogger.customShellCmd).toHaveBeenCalledWith(command)
    expect(execa.shell).toHaveBeenCalledWith(command)
    expect(execa.shell).lastReturnedWith({ stdout })
    expect(postgresRunner.runnerLogger.customShellCmdSuccess).toHaveBeenCalledWith(stdout)
  })
})
