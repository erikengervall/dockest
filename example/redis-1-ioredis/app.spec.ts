import dotenv from 'dotenv'
import main from './app'
// @ts-ignore
import { seedCake } from './data.json'

const env: any = dotenv.config().parsed
const describeFn = env.redis1ioredis_enabled === 'true' ? describe : describe.skip

const test = async () => {
  it('trabajo', async () => {
    const { redis } = main()

    const value = await redis.get(seedCake.key)
    expect(value).toEqual(seedCake.value)

    await redis.flushall()

    const flushedValue = await redis.get(seedCake.key)
    expect(flushedValue).toEqual(null)
  })
}

describeFn('redis-1-ioredis', test)
