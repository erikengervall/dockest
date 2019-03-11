import dotenv from 'dotenv'
import main from './app'
// @ts-ignore
import { seedBanana } from './data.json'

const env: any = dotenv.config().parsed
const describeFn = env.postgres2knex_enabled === 'true' ? describe : describe.skip

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

describeFn('postgres-2-knex', test)
