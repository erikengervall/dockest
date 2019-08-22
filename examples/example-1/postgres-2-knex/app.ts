import postgres2knex from './models'

const { seedBanana } = require('./data.json') // eslint-disable-line @typescript-eslint/no-var-requires

const getFirstEntry = async () =>
  postgres2knex('bananas')
    .where({ size: seedBanana.size })
    .first()

const app = async () => {
  const firstEntry = await getFirstEntry()

  return {
    firstEntry,
  }
}

export default app
