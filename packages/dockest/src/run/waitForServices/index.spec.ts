import { waitForServices } from './index'
import { checkConnection } from './checkConnection'
import { checkResponsiveness } from './healthcheck'
// import { fixRunnerHostAccessOnLinux } from './fixRunnerHostAccessOnLinux'
import { resolveContainerId } from './resolveContainerId'
import { runRunnerCommands } from './runRunnerCommands'
import { dockerComposeUp } from './dockerComposeUp'
import { joinBridgeNetwork } from '../../utils/network/joinBridgeNetwork'
import { sleepForX } from '../../utils/sleepForX'
import { bridgeNetworkExists } from '../../utils/network/bridgeNetworkExists'
import { createBridgeNetwork } from '../../utils/network/createBridgeNetwork'
import { createConfig, createRunner } from '../../test-utils'

jest.mock('./checkConnection')
jest.mock('./healthcheck')
// jest.mock('./fixRunnerHostAccessOnLinux')
jest.mock('./resolveContainerId')
jest.mock('./runRunnerCommands')
jest.mock('./dockerComposeUp')
jest.mock('../../utils/network/joinBridgeNetwork')
jest.mock('../../utils/sleepForX')
jest.mock('../../utils/network/bridgeNetworkExists')
jest.mock('../../utils/network/createBridgeNetwork')

describe('waitForServices', () => {
  beforeEach(jest.resetAllMocks)

  describe('happy', () => {
    it('should call expected functions for runners without dependents', async () => {
      const config = createConfig()
      config.$.runners = {
        runner1: createRunner({ serviceName: 'runner1' }),
        runner2: createRunner({ serviceName: 'runner2' }),
        runner3: createRunner({ serviceName: 'runner3' }),
      }
      const runners = Object.values(config.$.runners)

      await waitForServices(config)

      // waitForRunner
      expect(dockerComposeUp).toHaveBeenCalledTimes(3)
      runners.forEach(({ serviceName }) => expect(dockerComposeUp).toHaveBeenCalledWith(serviceName))

      expect(resolveContainerId).toHaveBeenCalledTimes(3)
      runners.forEach(runner => expect(resolveContainerId).toHaveBeenCalledWith(runner))

      expect(joinBridgeNetwork).not.toHaveBeenCalled()
      // expect(fixRunnerHostAccessOnLinux).not.toHaveBeenCalled() // This'll be called in GitHub Actions

      expect(checkConnection).toHaveBeenCalledTimes(3)
      runners.forEach(runner => expect(checkConnection).toHaveBeenCalledWith(runner))

      expect(checkResponsiveness).toHaveBeenCalledTimes(3)
      runners.forEach(runner => expect(checkResponsiveness).toHaveBeenCalledWith(runner))

      expect(runRunnerCommands).toHaveBeenCalledTimes(3)
      runners.forEach(runner => expect(runRunnerCommands).toHaveBeenCalledWith(runner))

      // waitForServices
      expect(bridgeNetworkExists).not.toHaveBeenCalled()
      expect(createBridgeNetwork).not.toHaveBeenCalled()
      expect(joinBridgeNetwork).not.toHaveBeenCalled()
      expect(sleepForX).not.toHaveBeenCalled()
    })

    it('should call expected functions for runners with dependents', async () => {
      const config = createConfig()
      config.$.runners = {
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
      const runners = Object.values(config.$.runners)

      await waitForServices(config)

      // waitForRunner
      expect(dockerComposeUp).toHaveBeenCalledTimes(3)
      runners.forEach(({ serviceName }) => expect(dockerComposeUp).toHaveBeenCalledWith(serviceName))

      expect(resolveContainerId).toHaveBeenCalledTimes(3)
      runners.forEach(runner => expect(resolveContainerId).toHaveBeenCalledWith(runner))

      expect(joinBridgeNetwork).not.toHaveBeenCalled()
      // expect(fixRunnerHostAccessOnLinux).not.toHaveBeenCalled() // This'll be called in GitHub Actions

      expect(checkConnection).toHaveBeenCalledTimes(3)
      runners.forEach(runner => expect(checkConnection).toHaveBeenCalledWith(runner))

      expect(checkResponsiveness).toHaveBeenCalledTimes(3)
      runners.forEach(runner => expect(checkResponsiveness).toHaveBeenCalledWith(runner))

      expect(runRunnerCommands).toHaveBeenCalledTimes(3)
      runners.forEach(runner => expect(runRunnerCommands).toHaveBeenCalledWith(runner))

      // waitForServices
      expect(bridgeNetworkExists).not.toHaveBeenCalled()
      expect(createBridgeNetwork).not.toHaveBeenCalled()
      expect(joinBridgeNetwork).not.toHaveBeenCalled()
      expect(sleepForX).not.toHaveBeenCalled()
    })
  })
})
