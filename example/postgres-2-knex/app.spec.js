const main = require('./app')
const { seedBanana } = require('./data.json')

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
