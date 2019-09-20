import app from './app'

const { seedBanana } = require('./data.json') // eslint-disable-line @typescript-eslint/no-var-requires

describe('postgres-2-knex', () => {
  it('should get first entry', async () => {
    const { firstEntry } = await app()

    expect(firstEntry).toEqual(expect.objectContaining(seedBanana))
  })
})
