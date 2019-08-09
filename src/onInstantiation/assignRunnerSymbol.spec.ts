import { createMockProxy } from 'jest-mock-proxy'
import { DEFAULT_USER_CONFIG, INTERNAL_CONFIG, LOG_SYMBOLS } from '../constants'
import { runners } from '../index'
import assignRunnerSymbol from './assignRunnerSymbol'

jest.mock('../Logger')

const { RedisRunner } = runners
const createDockestConfig = (numberOfRunners: number = 1) => {
  const manyRedisRunners = Array.from(Array(numberOfRunners), (_, index) => {
    const redisRunner = new RedisRunner({ service: `${index}`, image: '_' })
    redisRunner.logger = createMockProxy()
    return redisRunner
  })

  return {
    runners: manyRedisRunners,
    opts: DEFAULT_USER_CONFIG,
    jest: {},
    $: INTERNAL_CONFIG,
  }
}

describe('assignRunnerSymbol', () => {
  it('should handle the base case and reset the symbols', () => {
    const numberOfRunner = LOG_SYMBOLS.length + 1
    const dockestConfig = createDockestConfig(numberOfRunner)

    assignRunnerSymbol(dockestConfig)

    for (const runner of dockestConfig.runners) {
      expect(runner.logger.setRunnerSymbol).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(LOG_SYMBOLS.join('|'), 'gi')),
      )
    }
  })
})
