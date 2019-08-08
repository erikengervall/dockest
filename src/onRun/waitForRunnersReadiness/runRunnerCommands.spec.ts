import runRunnerCommands from './runRunnerCommands'
import testUtils, { mockedExecaStdout, runnerCommand } from '../../testUtils'

const { allRunners, execa } = testUtils({ withRunnerCommands: true })

describe('runRunnerCommands', () => {
  describe('test all runner types', () => {
    allRunners.forEach(runner => {
      it(`should work for ${runner.constructor.name}`, async () => {
        await runRunnerCommands(runner)

        expect(runner.logger.debug).toHaveBeenCalledWith(expect.stringContaining(runnerCommand))
        expect(execa).toHaveBeenCalledWith(runnerCommand, { shell: true })
        expect(execa).lastReturnedWith({ stdout: mockedExecaStdout })
        expect(runner.logger.debug).toHaveBeenCalledWith(expect.stringContaining(mockedExecaStdout), expect.anything())
      })
    })
  })
})
