import dotenv from 'dotenv'
import { execa } from '../../src'
import { runOrSkip } from '../testUtils'
import main from './app'
// @ts-ignore
import { seedUser } from './data.json'

const specWrapper = () => {
  beforeEach(async () => {
    await execa('sequelize db:seed:undo:all')
    await execa('sequelize db:seed:all')
  })

  describe('postgres-1-sequelize', () => {
    it('should get first entry', async () => {
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
  })
}

runOrSkip(dotenv.config().parsed.postgres1sequelize_enabled, specWrapper)
