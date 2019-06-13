import execa from 'execa'
import { runnerUtilsLogger } from '../../../loggers'
import runRunnerCommand from './runRunnerCommand'

const runnerKey = 'mockRunnerKey'
const command = 'mockCommand'
const stdout = `mockStdout`

jest.mock('execa', () => ({
  shell: jest.fn(() => ({
    stdout,
  })),
}))

jest.mock('../../../loggers', () => ({
  runnerUtilsLogger: {
    customShellCmd: jest.fn(),
    customShellCmdSuccess: jest.fn(),
  },
}))

describe('runRunnerCommand', () => {
  it('trabajo', async () => {
    await runRunnerCommand(runnerKey, command)

    expect(runnerUtilsLogger.customShellCmd).toHaveBeenCalledWith(runnerKey, command)
    expect(execa.shell).toHaveBeenCalledWith(command)
    expect(execa.shell).lastReturnedWith({ stdout })
    expect(runnerUtilsLogger.customShellCmdSuccess).toHaveBeenCalledWith(runnerKey, stdout)
  })
})
