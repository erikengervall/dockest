import createComposeObjFromRunners from './createComposeObjFromRunners'
import testUtils from '../../testUtils'

const { createDockestConfig, initializedRunners } = testUtils({})

describe('createComposeObjFromRunners', () => {
  it('should create composeObj from single runner', () => {
    const dockestConfig = createDockestConfig({
      runners: [initializedRunners.postgresRunner],
    })

    const composeObj = createComposeObjFromRunners(dockestConfig, '3.0')

    expect(composeObj).toMatchSnapshot()
  })

  it('should create composeObj from all initialized runners', () => {
    const dockestConfig = createDockestConfig({
      runners: Object.values(initializedRunners),
    })

    const composeObj = createComposeObjFromRunners(dockestConfig, '3.0')

    expect(composeObj).toMatchSnapshot()
  })
})
