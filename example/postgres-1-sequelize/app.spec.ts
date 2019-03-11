import dotenv from 'dotenv'
import { runners } from '../../src'
import main from './app'
// @ts-ignore
import { seedUser } from './data.json'

const env: any = dotenv.config().parsed
const describeFn = env.postgres1sequelize_enabled === 'true' ? describe : describe.skip
const { runHelpCmd } = runners.PostgresRunner.getHelpers()

const test = async () => {
  it('trabajo', async () => {
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

describeFn('postgres-1-sequelize', test)
