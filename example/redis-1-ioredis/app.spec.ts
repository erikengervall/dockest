import dotenv from 'dotenv'
import { runOrSkip } from '../testUtils'
import main from './app'
// @ts-ignore
import { seedCake } from './data.json'

const specWrapper = () =>
  describe('redis-1-ioredis', () => {
    it('trabajo', async () => {
      const { redis } = main()

      const value = await redis.get(seedCake.key)
      expect(value).toEqual(seedCake.value)

      await redis.flushall()

      const flushedValue = await redis.get(seedCake.key)
      expect(flushedValue).toEqual(null)
    })
  })

runOrSkip(dotenv.config().parsed.redis1ioredis_enabled, specWrapper)
