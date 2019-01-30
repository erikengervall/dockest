// @ts-ignore
import { seedBanana } from './data.json'
import postgres2knex from './models'

const getFirstEntry = async () =>
  postgres2knex('bananas')
    .where({ size: seedBanana.size })
    .first()

const main = async () => {
  const firstEntry = await getFirstEntry()

  return {
    firstEntry,
  }
}

export default main
