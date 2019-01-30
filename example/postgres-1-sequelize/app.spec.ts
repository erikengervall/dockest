import main from './app'
// @ts-ignore
import { seedUser } from './data.json'

describe('postgres-1-sequelize', () => {
  it('trabajo', async () => {
    const result = await main()

    expect(result).toEqual(
      expect.objectContaining({
        firstEntry: expect.objectContaining(seedUser),
      })
    )
  })
})
