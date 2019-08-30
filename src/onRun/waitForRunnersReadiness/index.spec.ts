import waitForRunnersReadiness from './index'
import _resolveContainerId from './resolveContainerId'
import _checkConnection from './checkConnection'
import _checkResponsiveness from './checkResponsiveness'
import _runRunnerCommands from './runRunnerCommands'
import testUtils from '../../testUtils'

const {
  createDockestConfig,
  initializedRunners: { simpleRunner },
  runners: { SimpleRunner },
} = testUtils({})

const checkConnection = _checkConnection as jest.Mock
const checkResponsiveness = _checkResponsiveness as jest.Mock
const resolveContainerId = _resolveContainerId as jest.Mock
const runRunnerCommands = _runRunnerCommands as jest.Mock

jest.mock('./resolveContainerId')
jest.mock('./checkConnection')
jest.mock('./checkResponsiveness')
jest.mock('./runRunnerCommands')

describe('waitForRunnersReadiness', () => {
  const runners = [simpleRunner]

  beforeEach(() => {
    resolveContainerId.mockClear()
    checkConnection.mockClear()
    checkResponsiveness.mockClear()
    runRunnerCommands.mockClear()
  })

  it('should work for a simple one-runner application', async () => {
    const dockestConfig = createDockestConfig({ runners })

    const result = await waitForRunnersReadiness(dockestConfig)

    expect(result).toEqual(undefined)
    expect(resolveContainerId).toHaveBeenCalled()
    expect(checkConnection).toHaveBeenCalled()
    expect(checkResponsiveness).toHaveBeenCalled()
    expect(runRunnerCommands).toHaveBeenCalled()
  })

  it('should handle runners being dependend on by multiple runners', async () => {
    const POPULAR_RUNNER = new SimpleRunner({ service: 'POPULAR_RUNNER' }) // abort itself POPULAR_RUNNER>
    const FOLLOWER_ONE = new SimpleRunner({ service: 'FOLLOWER_ONE', dependsOn: [POPULAR_RUNNER] }) // start POPULAR_RUNNER, start itself FOLLOWER_ONE
    const FOLLOWER_TWO = new SimpleRunner({ service: 'FOLLOWER_TWO', dependsOn: [POPULAR_RUNNER] }) // abort POPULAR_RUNNER, start itself FOLLOWER_TWO
    const runners = [FOLLOWER_ONE, POPULAR_RUNNER, FOLLOWER_TWO]
    const dockestConfig = createDockestConfig({ runners })

    const result = await waitForRunnersReadiness(dockestConfig)

    expect(result).toEqual(undefined)
    expect(resolveContainerId).toHaveBeenCalledTimes(3)
    expect(checkConnection).toHaveBeenCalledTimes(3)
    expect(checkResponsiveness).toHaveBeenCalledTimes(3)
    expect(runRunnerCommands).toHaveBeenCalledTimes(3)
    expect(FOLLOWER_ONE.logger.info).not.toHaveBeenCalledWith(
      expect.stringContaining(`has already been setup by`),
      expect.anything(),
    )
    expect(POPULAR_RUNNER.logger.info).toHaveBeenCalledWith(
      `"${POPULAR_RUNNER.runnerConfig.service}" has already been setup by "${POPULAR_RUNNER.initializer}" - skipping`,
      expect.anything(),
    )
    expect(FOLLOWER_TWO.logger.info).not.toHaveBeenCalledWith(
      expect.stringContaining(`has already been setup by`),
      expect.anything(),
    )
  })
})
