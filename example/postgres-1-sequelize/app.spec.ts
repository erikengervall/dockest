import dotenv from 'dotenv'
import { execa } from '../../src'
import main from './app'
// @ts-ignore
import { seedUser } from './data.json'

const env = dotenv.config().parsed
const describeFn = env.postgres1sequelize_enabled === 'true' ? describe : describe.skip

const test = async () => {
  it('trabajo', async () => {
    const result = await main()

    expect(result).toEqual(
      expect.objectContaining({
        firstEntry: expect.objectContaining(seedUser),
      })
    )
  })

  it('execa', async () => {
    await execa('sequelize db:seed:undo:all')

    const result = await main()

    expect(result).toEqual(
      expect.objectContaining({
        firstEntry: null,
      })
    )
  })
}

beforeEach(async () => {
  await execa('sequelize db:seed:undo:all')
  await execa('sequelize db:seed:all')
})

describeFn('postgres-1-sequelize', test)
