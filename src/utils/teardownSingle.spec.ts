import { createMockProxy } from 'jest-mock-proxy'
import testUtils from '../testUtils'
import teardownSingle from './teardownSingle'

const { redisRunner, execa } = testUtils({})
redisRunner.containerId = 'mockContainerId'

describe('teardownSingle', () => {
  beforeEach(() => {
    // @ts-ignore
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
      // @ts-ignore
      execa.mockImplementation(() => {
        throw error
      })

      await teardownSingle(redisRunner)

      expect(redisRunner.logger.info).toHaveBeenCalled()
      expect(redisRunner.logger.error).toHaveBeenCalled()
    })
  })
})
