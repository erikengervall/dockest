import execa from 'execa'
import { createMockProxy } from 'jest-mock-proxy'
import { RedisRunner } from '../runners'
import teardownSingle from './teardownSingle'

const stdout = `mockStdout`
const redisRunner = new RedisRunner({ service: '_' })
redisRunner.containerId = 'mockContainerId'
jest.mock('execa', () => jest.fn(() => ({ stdout })))

describe('teardownSingle', () => {
  beforeEach(() => {
    // @ts-ignore
    execa.mockClear()
    redisRunner.runnerLogger = createMockProxy()
  })

  describe('happy', () => {
    it('should work', async () => {
      await teardownSingle(redisRunner)

      expect(execa).toHaveBeenCalledWith(expect.stringMatching(/docker stop/), { shell: true })
      expect(execa).toHaveBeenCalledWith(expect.stringMatching(/docker rm/), { shell: true })
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

      expect(redisRunner.runnerLogger.stopContainerFailed).toHaveBeenCalled()
      expect(redisRunner.runnerLogger.removeContainerFailed).toHaveBeenCalled()
    })
  })
})
