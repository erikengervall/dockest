import runRunnerCommands from './runRunnerCommands'
import testUtils, { mockedExecaStdout, runnerCommand } from '../../testUtils'

const { initializedRunners, execa } = testUtils({ withRunnerCommands: true })

const { values } = Object

jest.mock('execa', () => jest.fn(() => ({ stdout: mockedExecaStdout })))

describe('runRunnerCommands', () => {
  describe('test all runner types', () => {
    values(initializedRunners).forEach(runner => {
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
