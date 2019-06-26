import dotenv from 'dotenv'
import { runOrSkip } from '../testUtils'
import main from './app'
// @ts-ignore
import { seedBanana } from './data.json'

const specWrapper = () =>
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

runOrSkip(dotenv.config().parsed.postgres2knex_enabled, specWrapper)
