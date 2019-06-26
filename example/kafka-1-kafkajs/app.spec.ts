import dotenv from 'dotenv'
import { runOrSkip } from '../testUtils'
import main from './app'

const specWrapper = () =>
  describe('kafka-1-kafkajs', () =>
    it('trabajo', async () => {
      const indicateConsumption = jest.fn()
      const indicateProduction = jest.fn()

      const result = await main({ indicateConsumption, indicateProduction })

      expect(result).toEqual(expect.objectContaining({ kafka: expect.any(Object) }))
    }))

runOrSkip(dotenv.config().parsed.kafka1confluentinc_enabled, specWrapper)
