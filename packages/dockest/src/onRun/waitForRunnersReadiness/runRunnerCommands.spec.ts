import runRunnerCommands from './runRunnerCommands'
import testUtils, { mockedExecaStdout } from '../../testUtils'

const { initializedRunners, execa } = testUtils({ withRunnerCommands: true })

const { values } = Object

jest.mock('execa', () => jest.fn(() => ({ stdout: mockedExecaStdout })))

describe('runRunnerCommands', () => {
  describe('test all runner types', () => {
    values(initializedRunners).forEach(runner => {
      it(`should work for ${runner.constructor.name}`, async () => {
        await runRunnerCommands(runner)

        expect(runner.logger.debug).toMatchSnapshot()
        expect(execa).toMatchSnapshot()
      })
    })
  })
})
