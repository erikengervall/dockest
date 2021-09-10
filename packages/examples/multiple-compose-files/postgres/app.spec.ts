import { execa } from 'dockest'
import { app } from './app'

const seedUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'demo@demo.com',
}

beforeEach(() => {
  execa('sequelize db:seed:undo:all')
  execa('sequelize db:seed:all')
})

describe('postgres-1-sequelize', () => {
  it('should get first entry', async () => {
    const { firstEntry } = await app()

    expect(firstEntry).toEqual(expect.objectContaining(seedUser))
  })

  it('should be able to execute custom shell scripts', async () => {
    execa('sequelize db:seed:undo:all')

    const { firstEntry } = await app()

    expect(firstEntry).toEqual(null)
  })
})
