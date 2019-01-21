const { seedBanana } = require('../../fixture.json')

const seed = knex =>
  knex('bananas').insert([{ id: 1, ...seedBanana }, { id: 2, size: 'YUGE', maturity: 'no bueno' }])

module.exports = {
  seed,
}
