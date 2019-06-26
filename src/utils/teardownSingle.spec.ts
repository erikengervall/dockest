import execa from 'execa'
import { createMockProxy } from 'jest-mock-proxy'
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

describe('teardownSingle', () => {
  beforeEach(() => {
    // @ts-ignore
    execa.shell.mockClear()
    postgresRunner.runnerLogger = createMockProxy()
  })

  describe('happy', () => {
    it('should work', async () => {
      await teardownSingle(postgresRunner)

      expect(execa.shell).toHaveBeenCalledWith(expect.stringMatching(/docker stop/))
      expect(execa.shell).toHaveBeenCalledWith(expect.stringMatching(/docker rm/))
    })
  })

  describe('sad', () => {
    it('should log and swallow teardown errors', async () => {
      const error = new Error('Unexpected teardown error')
      // @ts-ignore
      execa.shell.mockImplementation(() => {
        throw error
      })

      await teardownSingle(postgresRunner)

      expect(postgresRunner.runnerLogger.stopContainerFailed).toHaveBeenCalled()
      expect(postgresRunner.runnerLogger.removeContainerFailed).toHaveBeenCalled()
    })
  })
})
