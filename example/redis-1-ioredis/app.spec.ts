import dotenv from 'dotenv'
import main from './app'
// @ts-ignore
import { seedCake } from './data.json'

const env: any = dotenv.config().parsed

const test = async () => {
  it('main', async () => {
    const { redis } = main()

    const value = await redis.get(seedCake.key)
    expect(value).toEqual(seedCake.value)

    await redis.flushall()

    const flushedValue = await redis.get(seedCake.key)
    expect(flushedValue).toEqual(null)
  })
}

if (env.redis1ioredis_enabled === 'true') {
  describe('redis-1-ioredis', test)
} else {
  describe.skip('', () => it.skip('', () => undefined))
}
