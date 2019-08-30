import assignRunnerSymbol from './assignRunnerSymbol'
import { LOG_SYMBOLS } from '../constants'
import testUtils from '../testUtils'

const {
  createDockestConfig,
  runners: { SimpleRunner },
} = testUtils({})

jest.mock('../Logger')

describe('assignRunnerSymbol', () => {
  it('should handle the base case and reset the symbols', () => {
    const runners = Array.from(
      Array(LOG_SYMBOLS.length + 1),
      (_, index) => new SimpleRunner({ service: `${index}`, image: '_' }),
    )
    const dockestConfig = createDockestConfig({ runners })

    assignRunnerSymbol(dockestConfig)

    for (const runner of dockestConfig.runners) {
      expect(runner.logger.setRunnerSymbol).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(LOG_SYMBOLS.join('|'), 'gi')),
      )
    }
  })
})
