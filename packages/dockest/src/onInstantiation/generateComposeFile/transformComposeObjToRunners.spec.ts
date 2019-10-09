import transformComposeObjToRunners from './transformComposeObjToRunners'
import testUtils from '../../testUtils'
import { postgresAndRedis } from '../../../fixtures/composeObj'

const { createDockestConfig, initializedRunners } = testUtils({ realLoggers: true })

describe('transformComposeObjToRunners', () => {
  it('should detect conflict and prioritize attachedRunners', () => {
    const dockestConfig = createDockestConfig({
      runners: [initializedRunners.redisRunner],
      realLoggers: true,
    })

    const result = transformComposeObjToRunners(dockestConfig, postgresAndRedis)

    expect(result).toMatchSnapshot()
  })
})
