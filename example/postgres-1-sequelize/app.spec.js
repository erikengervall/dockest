const main = require('./app')
const { seedUser } = require('./data.json')

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
