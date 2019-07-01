import dotenv from 'dotenv'
import { execa } from '../../src'
import { runOrSkip } from '../testUtils'
import app from './app'
// @ts-ignore
import { seedBanana } from './data.json'

const specWrapper = () =>
  describe('postgres-2-knex', () => {
    it('should get first entry', async () => {
      const { firstEntry } = await app()

      expect(firstEntry).toEqual(expect.objectContaining(seedBanana))
    })

    it('should be able to execute custom shell scripts', async () => {
      await execa('../node_modules/knex/bin/cli.js migrate:rollback')

      const { firstEntry } = await app()

      expect(firstEntry).toEqual(null)
    })
  })

runOrSkip(dotenv.config().parsed.postgres2knex_enabled, specWrapper)
