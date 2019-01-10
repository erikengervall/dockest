exports.seed = knex =>
  knex('bananas').insert([
    { id: 1, size: 'small', maturity: 'no bueno' },
    { id: 2, size: 'medium', maturity: 'quite bueno' },
  ])
