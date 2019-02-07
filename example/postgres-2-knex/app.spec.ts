import dotenv from 'dotenv'
import main from './app'
// @ts-ignore
import { seedBanana } from './data.json'

const env: any = dotenv.config().parsed

const describeName = 'postgres-2-knex'
const test = () => {
  it('trabajo', async () => {
    const result = await main()

    expect(result).toEqual(
      expect.objectContaining({
        firstEntry: expect.objectContaining(seedBanana),
      })
    )
  })
}

if (env.postgres2knex_enabled === 'true') {
  describe(describeName, test)
} else {
  describe.skip(describeName, test)
}
