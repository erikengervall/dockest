import transformComposeObjToRunners from './transformComposeObjToRunners'
import testUtils from '../../testUtils'
import { singlePostgres, postgresAndRedis } from '../../../fixtures/composeObj'

const { createDockestConfig, initializedRunners } = testUtils({ realLoggers: true })

describe('transformComposeObjToRunners', () => {
  it('should detect conflict and use the already existing runner', () => {
    const dockestConfig = createDockestConfig({
      runners: Object.values(initializedRunners),
      realLoggers: true,
    })

    const result = transformComposeObjToRunners(dockestConfig, singlePostgres)

    expect(result).toMatchSnapshot()
  })

  it('should detect conflict and use the already existing runner', () => {
    const dockestConfig = createDockestConfig({
      runners: [initializedRunners.redisRunner],
      realLoggers: true,
    })

    const result = transformComposeObjToRunners(dockestConfig, postgresAndRedis)

    expect(result).toMatchSnapshot()
  })
})
