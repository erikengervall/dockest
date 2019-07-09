import testUtils, { mockedExecaStdout } from '../../testUtils'
import { testables } from './resolveContainerId'

const { getContainerId } = testables
const { redisRunner, execa } = testUtils({})
jest.mock('execa', () => jest.fn(() => ({ stdout: mockedExecaStdout })))

describe('getContainerId', () => {
  it('should work', async () => {
    const containerId = await getContainerId(redisRunner)

    expect(redisRunner.runnerLogger.shellCmd).toHaveBeenCalledWith(
      expect.stringMatching(/docker ps/)
    )
    expect(execa).toHaveBeenCalledWith(expect.stringMatching(/docker ps/), { shell: true })
    expect(execa).lastReturnedWith({ stdout: mockedExecaStdout })
    expect(containerId).toEqual(mockedExecaStdout)
  })
})
