import execaWrapper from './execaWrapper'
import testUtils, { mockedExecaStdout } from '../testUtils'

const { redisRunner, Logger, execa } = testUtils({})

jest.mock('execa', () => jest.fn(() => ({ stdout: mockedExecaStdout })))
jest.mock('../Logger')

describe('execaWrapper', () => {
  const command = 'run some CLI command :please:'

  describe('with runner', () => {
    it('should work', async () => {
      const result = await execaWrapper(command, redisRunner)

      expect(redisRunner.logger.debug).toHaveBeenCalledWith(expect.stringContaining(command))
      expect(execa).toHaveBeenCalledWith(command, { shell: true })
      expect(redisRunner.logger.debug).toHaveBeenCalledWith(expect.stringContaining(command))
      expect(result).toEqual(mockedExecaStdout)
    })
  })

  describe('without runner', () => {
    it('should work', async () => {
      const result = await execaWrapper(command)

      expect(Logger.debug).toHaveBeenCalledWith(expect.stringContaining(command))
      expect(execa).toHaveBeenCalledWith(command, { shell: true })
      expect(Logger.debug).toHaveBeenCalledWith(expect.stringContaining(command))
      expect(result).toEqual(mockedExecaStdout)
    })
  })
})
