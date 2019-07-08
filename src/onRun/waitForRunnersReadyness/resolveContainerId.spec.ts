import execa from 'execa'
import { createMockProxy } from 'jest-mock-proxy'
import { RedisRunner } from '../../runners'
import { testables } from './resolveContainerId'

const { getContainerId } = testables
const stdout = `mockStdout`
const redisRunner = new RedisRunner({ service: '_' })
jest.mock('execa', () => jest.fn(() => ({ stdout })))

beforeEach(() => {
  redisRunner.runnerLogger = createMockProxy()
})

describe('getContainerId', () => {
  it('should work', async () => {
    const containerId = await getContainerId(redisRunner)

    expect(redisRunner.runnerLogger.shellCmd).toHaveBeenCalledWith(
      expect.stringMatching(/docker ps/)
    )
    expect(execa).toHaveBeenCalledWith(expect.stringMatching(/docker ps/), { shell: true })
    expect(execa).lastReturnedWith({ stdout })
    expect(containerId).toEqual(stdout)
  })
})
