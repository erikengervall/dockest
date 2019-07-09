import testUtils, { mockedExecaStdout, runnerCommand } from '../../testUtils'
import runRunnerCommands from './runRunnerCommands'

const { allRunners, execa } = testUtils({ withRunnerCommands: true })
jest.mock('execa', () => jest.fn(() => ({ stdout: mockedExecaStdout })))

describe('runRunnerCommands', () => {
  describe('test all runner types', () => {
    allRunners.forEach(runner => {
      it(`should work for ${runner.constructor.name}`, async () => {
        await runRunnerCommands(runner)

        expect(runner.runnerLogger.customShellCmd).toHaveBeenCalledWith(runnerCommand)
        expect(execa).toHaveBeenCalledWith(runnerCommand, { shell: true })
        expect(execa).lastReturnedWith({ stdout: mockedExecaStdout })
        expect(runner.runnerLogger.customShellCmdSuccess).toHaveBeenCalledWith(mockedExecaStdout)
      })
    })
  })
})
