import { testables } from './resolveContainerId'
import testUtils, { mockedExecaStdout } from '../../testUtils'

const { getContainerId } = testables
const { redisRunner, execa } = testUtils({})

describe('getContainerId', () => {
  it('should work', async () => {
    const containerId = await getContainerId(redisRunner)

    expect(redisRunner.logger.debug).toHaveBeenCalledWith(expect.stringMatching('docker ps'))
    expect(execa).toHaveBeenCalledWith(expect.stringMatching('docker ps'), { shell: true })
    expect(execa).lastReturnedWith({ stdout: mockedExecaStdout })
    expect(containerId).toEqual(mockedExecaStdout)
  })
})
