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
jest.mock('execa', () => jest.fn(() => ({ stdout })))

describe('teardownSingle', () => {
  beforeEach(() => {
    // @ts-ignore
    execa.mockClear()
    postgresRunner.runnerLogger = createMockProxy()
  })

  describe('happy', () => {
    it('should work', async () => {
      await teardownSingle(postgresRunner)

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

      await teardownSingle(postgresRunner)

      expect(postgresRunner.runnerLogger.stopContainerFailed).toHaveBeenCalled()
      expect(postgresRunner.runnerLogger.removeContainerFailed).toHaveBeenCalled()
    })
  })
})
