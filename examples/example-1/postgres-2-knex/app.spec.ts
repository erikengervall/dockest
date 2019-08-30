import dotenv from 'dotenv'
import app from './app'
import { runOrSkip } from '../testUtils'

const { seedBanana } = require('./data.json') // eslint-disable-line @typescript-eslint/no-var-requires

const env: any = dotenv.config().parsed

const specWrapper = () =>
  describe('postgres-2-knex', () => {
    it('should get first entry', async () => {
      const { firstEntry } = await app()

      expect(firstEntry).toEqual(expect.objectContaining(seedBanana))
    })
  })

runOrSkip(env.postgres2knex_enabled, specWrapper)
