import execaWrapper from './execaWrapper'
import testUtils, { mockedExecaStdout } from '../testUtils'

const {
  initializedRunners: { redisRunner },
  Logger,
  execa,
} = testUtils({})

jest.mock('execa', () => jest.fn(() => ({ stdout: mockedExecaStdout })))
jest.mock('../Logger')

describe('execaWrapper', () => {
  const command = 'run some CLI command :please:'

  describe('with runner', () => {
    it('should work', async () => {
      const result = await execaWrapper(command, redisRunner)

      expect(redisRunner.logger.debug).toMatchSnapshot()
      expect(execa).toMatchSnapshot()
      expect(result).toMatchSnapshot()
    })
  })

  describe('without runner', () => {
    it('should work', async () => {
      const result = await execaWrapper(command)

      expect(Logger.debug).toMatchSnapshot()
      expect(execa).toMatchSnapshot()
      expect(result).toMatchSnapshot()
    })
  })
})
