import execa from 'execa'
import { RunnerLogger } from '../../loggers'
import getContainerId from './getContainerId'

const serviceName = 'mockServiceName'
const stdout = `mockStdout`

jest.mock('execa', () => ({
  shell: jest.fn(() => ({
    stdout,
  })),
}))

jest.mock('../../loggers', () => ({
  RunnerLogger: {
    shellCmd: jest.fn(),
  },
}))

describe('getContainerId', () => {
  it('should work', async () => {
    const containerId = await getContainerId(serviceName)

    expect(RunnerLogger.shellCmd).toHaveBeenCalledWith(expect.stringMatching(/docker ps/))
    expect(execa.shell).toHaveBeenCalledWith(expect.stringMatching(/docker ps/))
    expect(execa.shell).lastReturnedWith({ stdout })
    expect(containerId).toEqual(stdout)
  })
})
