import execa from 'execa'
import { globalLogger } from '../loggers'
import { PostgresRunner } from '../runners'
import teardownSingle from './teardownSingle'

const stdout = `mockStdout`
const postgresRunner = new PostgresRunner({
  service: '_',
  username: '_',
  password: '_',
  database: '_',
})
postgresRunner.containerId = 'mockContainerId'

jest.mock('execa', () => ({
  shell: jest.fn(() => ({
    stdout,
  })),
}))

jest.mock('../loggers', () => ({
  globalLogger: {
    error: jest.fn(),
    shellCmd: jest.fn(),
    shellCmdSuccess: jest.fn(),
  },
  runnerLogger: {
    teardownSingle: jest.fn(),
    teardownSingleSuccess: jest.fn(),
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
      await teardownSingle(postgresRunner)

      expect(globalLogger.shellCmd).toHaveBeenCalledWith(expect.stringMatching(/docker stop/))
      expect(execa.shell).toHaveBeenCalledWith(expect.stringMatching(/docker stop/))
      expect(globalLogger.shellCmd).toHaveBeenCalledWith(expect.stringMatching(/docker rm/))
      expect(execa.shell).toHaveBeenCalledWith(expect.stringMatching(/docker rm/))
      expect(globalLogger.error).not.toHaveBeenCalled()
    })
  })

  describe('sad', () => {
    it('should swallow errors', async () => {
      const error = new Error('no-bueno')
      // @ts-ignore
      execa.shell.mockImplementation(() => {
        throw error
      })

      await teardownSingle(postgresRunner)

      expect(globalLogger.shellCmd).toHaveBeenCalledWith(expect.stringMatching(/docker stop/))
      expect(globalLogger.error).toHaveBeenCalledWith(expect.stringMatching(/stop/), error)
      expect(globalLogger.shellCmd).toHaveBeenCalledWith(expect.stringMatching(/docker rm/))
      expect(globalLogger.error).toHaveBeenCalledWith(expect.stringMatching(/remove/), error)
    })
  })
})
