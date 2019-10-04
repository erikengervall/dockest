import waitForRunnersReadiness from './index'
import _resolveContainerId from './resolveContainerId'
import _checkConnection from './checkConnection'
import _checkResponsiveness from './checkResponsiveness'
import _runRunnerCommands from './runRunnerCommands'
import _fixRunnerHostAccessOnLinux from './fixRunnerHostAccessOnLinux'
import testUtils from '../../testUtils'

const {
  createDockestConfig,
  initializedRunners: { generalPurposeRunner },
  runners: { GeneralPurposeRunner },
} = testUtils({})

const checkConnection = _checkConnection as jest.Mock
const checkResponsiveness = _checkResponsiveness as jest.Mock
const resolveContainerId = _resolveContainerId as jest.Mock
const runRunnerCommands = _runRunnerCommands as jest.Mock
const fixRunnerHostAccessOnLinux = _fixRunnerHostAccessOnLinux as jest.Mock

jest.mock('./resolveContainerId')
jest.mock('./checkConnection')
jest.mock('./checkResponsiveness')
jest.mock('./runRunnerCommands')
jest.mock('./fixRunnerHostAccessOnLinux')

describe('waitForRunnersReadiness', () => {
  const runners = [generalPurposeRunner]

  beforeEach(() => {
    resolveContainerId.mockClear()
    checkConnection.mockClear()
    checkResponsiveness.mockClear()
    runRunnerCommands.mockClear()
    fixRunnerHostAccessOnLinux.mockClear()
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
    // abort itself POPULAR_RUNNER>
    const POPULAR_RUNNER = new GeneralPurposeRunner({
      service: 'POPULAR_RUNNER',
      image: 'some/image:123',
    })
    // start POPULAR_RUNNER, start itself FOLLOWER_ONE
    const FOLLOWER_ONE = new GeneralPurposeRunner({
      service: 'FOLLOWER_ONE',
      image: 'some/image:123',
      dependsOn: [POPULAR_RUNNER],
    })
    // abort POPULAR_RUNNER, start itself FOLLOWER_TWO
    const FOLLOWER_TWO = new GeneralPurposeRunner({
      service: 'FOLLOWER_TWO',
      image: 'some/image:123',
      dependsOn: [POPULAR_RUNNER],
    })
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
