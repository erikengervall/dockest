// @ts-ignore
import { seedUser } from './data.json'
import main from './index'

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
