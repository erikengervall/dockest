import dotenv from 'dotenv'
import { runners } from '../../src/index'
import main from './app'
// @ts-ignore
import { seedUser } from './data.json'

const env: any = dotenv.config().parsed
const { runHelpCmd } = runners.PostgresRunner.getHelpers()

const test = async () => {
  it('main', async () => {
    const result = await main()

    expect(result).toEqual(
      expect.objectContaining({
        firstEntry: expect.objectContaining(seedUser),
      })
    )
  })

  it('runHelpCmd', async () => {
    await runHelpCmd('sequelize db:seed:undo:all')

    const result = await main()

    expect(result).toEqual(
      expect.objectContaining({
        firstEntry: null,
      })
    )
  })
}

beforeEach(async () => {
  await runHelpCmd('sequelize db:seed:undo:all')
  await runHelpCmd('sequelize db:seed:all')
})

if (env.postgres1sequelize_enabled === 'true') {
  describe('postgres-1-sequelize', test)
} else {
  describe.skip('', () => it.skip('', () => undefined))
}
