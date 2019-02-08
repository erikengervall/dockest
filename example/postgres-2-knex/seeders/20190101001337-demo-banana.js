const { seedBanana } = require('../data.json')

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
