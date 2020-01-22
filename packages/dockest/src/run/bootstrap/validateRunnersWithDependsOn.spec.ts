import { validateRunnersWithDependsOn } from './validateRunnersWithDependsOn'
import { createRunner } from '../../test-utils'
import { RunnersObj } from '../../@types'

describe('validateRunnersWithDependsOn', () => {
  describe('happy', () => {
    it('should work', () => {
      // imagine a `runner1` which is the master dependency
      const runnersWithDependencies: RunnersObj = {
        runner2: createRunner({
          dockestService: {
            serviceName: 'runner2',
            dependsOn: 'runner1',
          },
        }),
        runner3: createRunner({
          dockestService: {
            serviceName: 'runner3',
            dependsOn: 'runner1',
          },
        }),
      }

      expect(() => validateRunnersWithDependsOn(runnersWithDependencies)).not.toThrow()
    })
  })

  describe('sad', () => {
    it('should fail', () => {
      const runnersWithDependencies: RunnersObj = {
        runner2: createRunner({
          dockestService: {
            serviceName: 'runner2',
            dependsOn: 'runner1',
          },
        }),
        runner3: createRunner({
          dockestService: {
            serviceName: 'runner3',
            dependsOn: 'runner2', // This'll cause failure since it's depending on a runner that already has a dependecy
          },
        }),
      }

      expect(() => validateRunnersWithDependsOn(runnersWithDependencies)).toThrow(
        'Multi-level dependencies is currently not supported',
      )
    })
  })
})
