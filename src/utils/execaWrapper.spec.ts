import execa from 'execa'
import { createMockProxy } from 'jest-mock-proxy'
import globalLogger from '../loggers/globalLogger'
import { RedisRunner } from '../runners'
import execaWrapper from './execaWrapper'

const stdout = 'stdout says hello'
jest.mock('execa', () =>
  jest.fn(() => ({
    stdout,
  }))
)
jest.mock('../loggers/globalLogger', () => ({
  shellCmd: jest.fn(),
  shellCmdSuccess: jest.fn(),
}))

const redisRunner = new RedisRunner({ service: '_' })
beforeEach(() => {
  redisRunner.runnerLogger = createMockProxy()
})

describe('execaWrapper', () => {
  const command = 'run some CLI command :please:'

  describe('with runner', () => {
    it('should work', async () => {
      const result = await execaWrapper(command, redisRunner)

      expect(redisRunner.runnerLogger.shellCmd).toHaveBeenCalledWith(command)
      expect(execa).toHaveBeenCalledWith(command, { shell: true })
      expect(redisRunner.runnerLogger.shellCmdSuccess).toHaveBeenCalledWith(command)
      expect(result).toEqual(stdout)
    })
  })

  describe('without runner', () => {
    it('should work', async () => {
      const result = await execaWrapper(command)

      expect(globalLogger.shellCmd).toHaveBeenCalledWith(command)
      expect(execa).toHaveBeenCalledWith(command, { shell: true })
      expect(globalLogger.shellCmdSuccess).toHaveBeenCalledWith(command)
      expect(result).toEqual(stdout)
    })
  })
})
