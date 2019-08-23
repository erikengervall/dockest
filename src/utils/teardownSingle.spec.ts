import { createMockProxy } from 'jest-mock-proxy'
import teardownSingle from './teardownSingle'
import testUtils, { mockedExecaStdout } from '../testUtils'

const { redisRunner, execa } = testUtils({})
redisRunner.containerId = 'mockContainerId'

jest.mock('execa', () => jest.fn(() => ({ stdout: mockedExecaStdout })))

describe('teardownSingle', () => {
  beforeEach(() => {
    execa.mockClear()
    redisRunner.logger = createMockProxy()
  })

  describe('happy', () => {
    it('should work', async () => {
      await teardownSingle(redisRunner)

      expect(execa).toHaveBeenCalledWith(expect.stringMatching('docker stop'), { shell: true })
      expect(execa).toHaveBeenCalledWith(expect.stringMatching('docker rm'), { shell: true })
    })
  })

  describe('sad', () => {
    it('should log and swallow teardown errors', async () => {
      const error = new Error('Unexpected teardown error')
      execa.mockImplementation(() => {
        throw error
      })

      await teardownSingle(redisRunner)

      expect(redisRunner.logger.info).toHaveBeenCalled()
      expect(redisRunner.logger.error).toHaveBeenCalled()
    })
  })
})
