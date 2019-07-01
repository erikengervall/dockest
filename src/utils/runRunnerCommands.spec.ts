import execa from 'execa'
import { createMockProxy } from 'jest-mock-proxy'
import { PostgresRunner } from '../runners'
import runRunnerCommands from './runRunnerCommands'

const command = 'mockCommand'
const stdout = `mockStdout`
const postgresRunner = new PostgresRunner({
  service: '_',
  username: '_',
  password: '_',
  database: '_',
  commands: [command],
})
jest.mock('execa', () => jest.fn(() => ({ stdout })))

beforeEach(() => {
  postgresRunner.runnerLogger = createMockProxy()
})

describe('runRunnerCommands', () => {
  it('trabajo', async () => {
    await runRunnerCommands(postgresRunner)

    expect(postgresRunner.runnerLogger.customShellCmd).toHaveBeenCalledWith(command)
    expect(execa).toHaveBeenCalledWith(command, { shell: true })
    expect(execa).lastReturnedWith({ stdout })
    expect(postgresRunner.runnerLogger.customShellCmdSuccess).toHaveBeenCalledWith(stdout)
  })
})
