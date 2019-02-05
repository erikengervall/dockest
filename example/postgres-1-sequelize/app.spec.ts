import dotenv from 'dotenv'
import main from './app'
// @ts-ignore
import { seedUser } from './data.json'

const env: any = dotenv.config().parsed

const describeName = 'postgres-1-sequelize'
const test = async () => {
  it('trabajo', async () => {
    const result = await main()

    expect(result).toEqual(
      expect.objectContaining({
        firstEntry: expect.objectContaining(seedUser),
      })
    )
  })
}

if (env.postgres1sequelize_enabled === 'true') {
  describe(describeName, test)
} else {
  describe.skip(describeName, test)
}
