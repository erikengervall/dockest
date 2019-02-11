import dotenv from 'dotenv'
import main from './app'
// @ts-ignore
import { seedCake } from './data.json'

const env: any = dotenv.config().parsed

const test = async () => {
  it('main', async () => {
    const { redis } = await main()

    const value = redis.get(seedCake.key)

    expect(value).toEqual(seedCake.value)
  })
}

if (env.redis1ioredis_enabled === 'true') {
  describe('redis-1-ioredis', test)
} else {
  describe.skip('', () => it.skip('', () => undefined))
}
