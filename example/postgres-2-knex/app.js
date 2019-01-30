// @ts-ignore
const { seedBanana } = require('./data.json')
const postgres2knex = require('./models')

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

module.exports = main
