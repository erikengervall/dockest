import teardownSingle from './teardownSingle'
import testUtils, { mockedExecaStdout } from '../testUtils'

const {
  initializedRunners: { simpleRunner },
  execa,
} = testUtils({})
simpleRunner.containerId = 'mockContainerId'

jest.mock('execa', () => jest.fn(() => ({ stdout: mockedExecaStdout })))

describe('teardownSingle', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    execa.mockClear()
  })

  describe('happy', () => {
    it('should work', async () => {
      await teardownSingle(simpleRunner)

      expect(execa).toHaveBeenCalledWith(expect.stringMatching('docker stop'), { shell: true })
      expect(execa).toHaveBeenCalledWith(expect.stringMatching('docker rm'), { shell: true })
    })
  })

  describe('sad', () => {
    it('should log and swallow teardown errors', async () => {
      const error = new Error('Unexpected teardown error')
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      execa.mockImplementation(() => {
        throw error
      })

      await teardownSingle(simpleRunner)

      expect(simpleRunner.logger.info).toHaveBeenCalled()
      expect(simpleRunner.logger.error).toHaveBeenCalled()
    })
  })
})
