import execa from 'execa'
import { runnerUtilsLogger } from '../../loggers'
import getContainerId from './getContainerId'

const serviceName = 'mockServiceName'
const stdout = `mockStdout`

jest.mock('execa', () => ({
  shell: jest.fn(() => ({
    stdout,
  })),
}))

jest.mock('../../loggers', () => ({
  runnerUtilsLogger: {
    shellCmd: jest.fn(),
    shellCmdSuccess: jest.fn(),
  },
}))

describe('getContainerId', () => {
  it('should work', async () => {
    const containerId = await getContainerId(serviceName)

    expect(runnerUtilsLogger.shellCmd).toHaveBeenCalledWith(expect.stringMatching(/docker ps/))
    expect(execa.shell).toHaveBeenCalledWith(expect.stringMatching(/docker ps/))
    expect(execa.shell).lastReturnedWith({ stdout })
    expect(containerId).toEqual(stdout)
  })
})
