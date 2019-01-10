const { seedBanana } = require('../../fixture')

exports.seed = knex =>
  knex('bananas').insert([{ id: 1, ...seedBanana }, { id: 2, size: 'YUGE', maturity: 'no bueno' }])
