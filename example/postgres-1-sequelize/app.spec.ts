import dotenv from 'dotenv'
import { execa } from '../../src'
import { runOrSkip } from '../testUtils'
import app from './app'
// @ts-ignore
import { seedUser } from './data.json'

const specWrapper = () => {
  beforeEach(async () => {
    await execa('sequelize db:seed:undo:all')
    await execa('sequelize db:seed:all')
  })

  describe('postgres-1-sequelize', () => {
    it('should get first entry', async () => {
      const { firstEntry } = await app()

      expect(firstEntry).toEqual(expect.objectContaining(seedUser))
    })

    it('should be able to execute custom shell scripts', async () => {
      await execa('sequelize db:seed:undo:all')

      const { firstEntry } = await app()

      expect(firstEntry).toEqual(null)
    })
  })
}

runOrSkip(dotenv.config().parsed.postgres1sequelize_enabled, specWrapper)
