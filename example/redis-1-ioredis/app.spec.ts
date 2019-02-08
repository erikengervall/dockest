import dotenv from 'dotenv'
import main from './app'
// @ts-ignore
import { seedUser } from './data.json'

const env: any = dotenv.config().parsed

const test = async () => {
  it('main', async () => {
    const result = await main()

    expect(result).toEqual(
      expect.objectContaining({
        firstEntry: expect.objectContaining(seedUser),
      })
    )
  })
}

if (env.redis1ioredis_enabled === 'true') {
  describe('redis-1-ioredis', test)
} else {
  describe.skip('', () => it.skip('', () => undefined))
}
