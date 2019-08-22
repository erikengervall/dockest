const { seedBanana } = require('../data.json') // eslint-disable-line @typescript-eslint/no-var-requires

const seed = knex =>
  knex('bananas').insert([
    {
      id: 1,
      ...seedBanana,
    },
  ])

module.exports = {
  seed,
}
