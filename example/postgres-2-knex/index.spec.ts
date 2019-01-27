// @ts-ignore
import { seedBanana } from './data.json'
import main from './index'

describe('postgres-2-knex', () => {
  it('trabajo', async () => {
    const result = await main()

    expect(result).toEqual(
      expect.objectContaining({
        firstEntry: expect.objectContaining(seedBanana),
      })
    )
  })
})
