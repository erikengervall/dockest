import dotenv from 'dotenv'
import { runOrSkip } from '../testUtils'
import app from './app'
// @ts-ignore
import { seedCake } from './data.json'

const specWrapper = () =>
  describe('redis-1-ioredis', () => {
    it('should retrieve seeded value', async () => {
      const { redis } = app()

      const value = await redis.get(seedCake.key)
      expect(value).toEqual(seedCake.value)
    })

    it('should handle flushall', async () => {
      const { redis } = app()

      await redis.flushall()

      const flushedValue = await redis.get(seedCake.key)
      expect(flushedValue).toEqual(null)
    })
  })

runOrSkip(dotenv.config().parsed.redis1ioredis_enabled, specWrapper)
