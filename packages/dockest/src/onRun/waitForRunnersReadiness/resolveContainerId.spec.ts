import { testables } from './resolveContainerId'
import testUtils, { mockedExecaStdout } from '../../testUtils'

const { getContainerId } = testables
const {
  initializedRunners: { redisRunner },
  execa,
} = testUtils({})

jest.mock('execa', () => jest.fn(() => ({ stdout: mockedExecaStdout })))

describe('getContainerId', () => {
  it('should work', async () => {
    const containerId = await getContainerId(redisRunner)

    expect(redisRunner.logger.debug).toMatchSnapshot()
    expect(execa).toMatchSnapshot()
    expect(containerId).toMatchSnapshot()
  })
})
