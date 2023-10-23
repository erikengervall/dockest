import { EventEmitter } from 'events'
import { waitForServices } from '.'
import { checkConnection } from './checkConnection'
import { runReadinessCheck } from './runReadinessCheck'
// import { fixRunnerHostAccessOnLinux } from './fixRunnerHostAccessOnLinux'
import { dockerComposeUp } from './dockerComposeUp'
import { resolveContainerId } from './resolveContainerId'
import { runRunnerCommands } from './runRunnerCommands'
import { sleepWithLog } from '../..'
import { createRunner } from '../../test-utils'
import { getOpts } from '../../utils/get-opts'
import { bridgeNetworkExists } from '../../utils/network/bridgeNetworkExists'
import { createBridgeNetwork } from '../../utils/network/createBridgeNetwork'
import { joinBridgeNetwork } from '../../utils/network/joinBridgeNetwork'
import { LogWriter } from '../log-writer'

jest.mock('./checkConnection')
jest.mock('./runReadinessCheck')
// jest.mock('./fixRunnerHostAccessOnLinux')
jest.mock('./resolveContainerId')
jest.mock('./runRunnerCommands')
jest.mock('./dockerComposeUp')
jest.mock('../../utils/network/joinBridgeNetwork')
jest.mock('../../utils/sleepWithLog')
jest.mock('../../utils/network/bridgeNetworkExists')
jest.mock('../../utils/network/createBridgeNetwork')

const { composeOpts, hostname, runInBand } = getOpts()

const mockLogWriter = {
  register: () => undefined,
  destroy: () => Promise.resolve(),
} as LogWriter

describe('waitForServices', () => {
  beforeEach(jest.resetAllMocks)

  describe('happy', () => {
    it('should call expected functions for runners without dependsOn', async () => {
      const runners = {
        runner1: createRunner({ serviceName: 'runner1' }),
        runner2: createRunner({ serviceName: 'runner2' }),
        runner3: createRunner({ serviceName: 'runner3' }),
      }

      await waitForServices({
        composeOpts,
        hostname,
        runMode: 'host',
        mutables: {
          runners,
          jestRanWithResult: false,
          dockerEventEmitter: new EventEmitter() as any,
          runnerLookupMap: new Map(),
          teardownOrder: null,
        },
        runInBand,
        skipCheckConnection: false,
        logWriter: mockLogWriter,
      })

      expect(dockerComposeUp).toHaveBeenCalledTimes(3)
      Object.values(runners).forEach(({ serviceName }) =>
        expect(dockerComposeUp).toHaveBeenCalledWith({ composeOpts, serviceName }),
      )

      expect(resolveContainerId).toHaveBeenCalledTimes(3)
      Object.values(runners).forEach(runner => expect(resolveContainerId).toHaveBeenCalledWith({ runner }))

      expect(joinBridgeNetwork).not.toHaveBeenCalled()
      // expect(fixRunnerHostAccessOnLinux).not.toHaveBeenCalled() // This'll bork in GitHub Actions due to different running environment

      expect(checkConnection).toHaveBeenCalledTimes(3)
      Object.values(runners).forEach(runner => expect(checkConnection).toHaveBeenCalledWith({ runner }))

      expect(runReadinessCheck).toHaveBeenCalledTimes(3)
      Object.values(runners).forEach(runner => expect(runReadinessCheck).toHaveBeenCalledWith({ runner }))

      expect(runRunnerCommands).toHaveBeenCalledTimes(3)
      Object.values(runners).forEach(runner => expect(runRunnerCommands).toHaveBeenCalledWith({ runner }))

      // waitForServices
      expect(bridgeNetworkExists).not.toHaveBeenCalled()
      expect(createBridgeNetwork).not.toHaveBeenCalled()
      expect(joinBridgeNetwork).not.toHaveBeenCalled()
      expect(sleepWithLog).not.toHaveBeenCalled()
    })

    it('should call expected functions for runners with dependsOn', async () => {
      const runner3 = createRunner({ serviceName: 'runner3' })
      const runner2 = createRunner({ serviceName: 'runner2' })
      const runner1 = createRunner({ serviceName: 'runner1', dependsOn: [runner2] })
      const runners = {
        runner1: runner1,
        runner3: runner3,
      }

      await waitForServices({
        composeOpts,
        hostname,
        runMode: 'host',
        mutables: {
          runners,
          jestRanWithResult: false,
          dockerEventEmitter: new EventEmitter() as any,
          runnerLookupMap: new Map(),
          teardownOrder: null,
        },
        runInBand,
        skipCheckConnection: false,
        logWriter: mockLogWriter,
      })

      // waitForRunner
      expect(dockerComposeUp).toHaveBeenCalledTimes(3)
      Object.values(runners).forEach(({ serviceName }) =>
        expect(dockerComposeUp).toHaveBeenCalledWith({ composeOpts, serviceName }),
      )

      expect(resolveContainerId).toHaveBeenCalledTimes(3)
      Object.values(runners).forEach(runner => expect(resolveContainerId).toHaveBeenCalledWith({ runner }))

      expect(joinBridgeNetwork).not.toHaveBeenCalled()
      // expect(fixRunnerHostAccessOnLinux).not.toHaveBeenCalled() // This'll bork in GitHub Actions due to different running environment

      expect(checkConnection).toHaveBeenCalledTimes(3)
      Object.values(runners).forEach(runner => expect(checkConnection).toHaveBeenCalledWith({ runner }))

      expect(runReadinessCheck).toHaveBeenCalledTimes(3)
      Object.values(runners).forEach(runner => expect(runReadinessCheck).toHaveBeenCalledWith({ runner }))

      expect(runRunnerCommands).toHaveBeenCalledTimes(3)
      Object.values(runners).forEach(runner => expect(runRunnerCommands).toHaveBeenCalledWith({ runner }))

      // waitForServices
      expect(bridgeNetworkExists).not.toHaveBeenCalled()
      expect(createBridgeNetwork).not.toHaveBeenCalled()
      expect(joinBridgeNetwork).not.toHaveBeenCalled()
      expect(sleepWithLog).not.toHaveBeenCalled()
    })
  })
})
