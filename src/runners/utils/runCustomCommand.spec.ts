import execa from 'execa'
import { RunnerUtilsLogger } from '../../loggers'
import runCustomCommand from './runCustomCommand'

const runnerKey = 'mockRunnerKey'
const command = 'mockCommand'
const stdout = `mockStdout`

jest.mock('execa', () => ({
  shell: jest.fn(() => ({
    stdout,
  })),
}))

jest.mock('../../loggers', () => ({
  RunnerUtilsLogger: {
    customShellCmd: jest.fn(),
    customShellCmdSuccess: jest.fn(),
  },
}))

describe('runCustomCommand', () => {
  it('should work', async () => {
    await runCustomCommand(runnerKey, command)

    expect(RunnerUtilsLogger.customShellCmd).toHaveBeenCalledWith(runnerKey, command)
    expect(execa.shell).toHaveBeenCalledWith(command)
    expect(execa.shell).lastReturnedWith({ stdout })
    expect(RunnerUtilsLogger.customShellCmdSuccess).toHaveBeenCalledWith(runnerKey, stdout)
  })
})
