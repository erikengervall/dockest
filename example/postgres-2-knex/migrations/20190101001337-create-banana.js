const up = knex =>
  knex.schema.createTable('bananas', table => {
    table.increments('id').primary()
    table.string('size')
    table.string('maturity')
  })

const down = knex => knex.schema.dropTableIfExists('bananas')

module.exports = {
  up,
  down,
}
