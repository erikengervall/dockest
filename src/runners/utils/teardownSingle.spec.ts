import execa from 'execa'
import { RunnerLogger } from '../../loggers' // GlobalLogger
import teardownSingle from './teardownSingle'

const runnerKey = 'mockRunnerKey'
const containerId = 'mockContainerId'
const stdout = `mockStdout`

jest.mock('execa', () => ({
  shell: jest.fn(() => ({
    stdout,
  })),
}))

jest.mock('../../loggers', () => ({
  GlobalLogger: {
    error: jest.fn(),
  },
  RunnerLogger: {
    shellCmd: jest.fn(),
    teardown: jest.fn(),
    teardownSuccess: jest.fn(),
    stopContainer: jest.fn(),
    stopContainerSuccess: jest.fn(),
    removeContainer: jest.fn(),
    removeContainerSuccess: jest.fn(),
  },
}))

describe('teardownSingle', () => {
  beforeEach(() => {
    // @ts-ignore
    execa.shell.mockClear()
  })

  describe('happy', () => {
    it('should work', async () => {
      await teardownSingle(containerId, runnerKey)

      expect(RunnerLogger.shellCmd).toHaveBeenCalledWith(expect.stringMatching(/docker stop/))
      expect(execa.shell).toHaveBeenCalledWith(expect.stringMatching(/docker stop/))
      expect(RunnerLogger.shellCmd).toHaveBeenCalledWith(expect.stringMatching(/docker rm/))
      expect(execa.shell).toHaveBeenCalledWith(expect.stringMatching(/docker rm/))
      // expect(GlobalLogger.error).not.toHaveBeenCalled()
    })
  })

  describe('sad', () => {
    it('should swallow errors', async () => {
      const error = new Error('no-bueno')
      // @ts-ignore
      execa.shell.mockImplementation(() => {
        throw error
      })

      await teardownSingle(containerId, runnerKey)

      expect(RunnerLogger.shellCmd).toHaveBeenCalledWith(expect.stringMatching(/docker stop/))
      // // expect(GlobalLogger.error).toHaveBeenCalledWith(expect.stringMatching(/stop/), error)
      expect(RunnerLogger.shellCmd).toHaveBeenCalledWith(expect.stringMatching(/docker rm/))
      // expect(GlobalLogger.error).toHaveBeenCalledWith(expect.stringMatching(/remove/), error)
    })
  })
})
