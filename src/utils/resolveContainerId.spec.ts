import execa from 'execa'
import { PostgresRunner } from '../runners'
import { testables } from './resolveContainerId'

const { getContainerId } = testables

const stdout = `mockStdout`
const postgresRunner = new PostgresRunner({
  service: '_',
  username: '_',
  password: '_',
  database: '_',
})

jest.mock('execa', () => ({
  shell: jest.fn(() => ({
    stdout,
  })),
}))

describe('getContainerId', () => {
  it('should work', async () => {
    // @ts-ignore
    postgresRunner.runnerLogger = jest.fn()

    const containerId = await getContainerId(postgresRunner)

    expect(postgresRunner.runnerLogger.shellCmd).toHaveBeenCalledWith(
      expect.stringMatching(/docker ps/)
    )
    expect(execa.shell).toHaveBeenCalledWith(expect.stringMatching(/docker ps/))
    expect(execa.shell).lastReturnedWith({ stdout })
    expect(containerId).toEqual(stdout)
  })
})
