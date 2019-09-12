import assignRunnerSymbol from './assignRunnerSymbol'
import { LOG_SYMBOLS } from '../constants'
import testUtils from '../testUtils'

const {
  createDockestConfig,
  runners: { GeneralPurposeRunner },
} = testUtils({})

jest.mock('../Logger')

describe('assignRunnerSymbol', () => {
  it('should handle the base case and reset the symbols', () => {
    const runners = Array.from(
      Array(LOG_SYMBOLS.length),
      (_, index) => new GeneralPurposeRunner({ service: `${index}`, image: '_' }),
    )
    const dockestConfig = createDockestConfig({ runners })

    assignRunnerSymbol(dockestConfig)

    for (const runner of dockestConfig.runners) {
      expect(runner.logger.setRunnerSymbol).toMatchSnapshot()
    }
  })
})
