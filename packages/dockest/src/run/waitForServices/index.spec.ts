import { EventEmitter } from 'events'
import { waitForServices } from './index'
import { checkConnection } from './checkConnection'
import { runReadinessCheck } from './runReadinessCheck'
// import { fixRunnerHostAccessOnLinux } from './fixRunnerHostAccessOnLinux'
import { resolveContainerId } from './resolveContainerId'
import { runRunnerCommands } from './runRunnerCommands'
import { dockerComposeUp } from './dockerComposeUp'
import { joinBridgeNetwork } from '../../utils/network/joinBridgeNetwork'
import { sleepWithLog } from '../../utils/sleepWithLog'
import { bridgeNetworkExists } from '../../utils/network/bridgeNetworkExists'
import { createBridgeNetwork } from '../../utils/network/createBridgeNetwork'
import { createRunner } from '../../test-utils'
import { getOpts } from '../../utils/getOpts'

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

const { composeOpts, hostname, isInsideDockerContainer, runInBand } = getOpts()

describe('waitForServices', () => {
  beforeEach(jest.resetAllMocks)

  describe('happy', () => {
    it('should call expected functions for runners without dependents', async () => {
      const runners = {
        runner1: createRunner({ serviceName: 'runner1' }),
        runner2: createRunner({ serviceName: 'runner2' }),
        runner3: createRunner({ serviceName: 'runner3' }),
      }

      await waitForServices({
        composeOpts,
        hostname,
        isInsideDockerContainer,
        mutables: { runners, jestRanWithResult: false, dockerEventEmitter: new EventEmitter() as any },
        runInBand,
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

    it('should call expected functions for runners with dependents', async () => {
      const runners = {
        runner1: createRunner({
          serviceName: 'runner1',
          dependents: [
            createRunner({
              serviceName: 'runner2',
            }),
          ],
        }),
        runner3: createRunner({ serviceName: 'runner3' }),
      }

      await waitForServices({
        composeOpts,
        hostname,
        isInsideDockerContainer,
        mutables: { runners, jestRanWithResult: false, dockerEventEmitter: new EventEmitter() as any },
        runInBand,
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
