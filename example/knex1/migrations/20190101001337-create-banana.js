exports.up = knex =>
  knex.schema.createTable('bananas', table => {
    table.increments('id').primary()
    table.string('size')
    table.string('maturity')
  })

exports.down = knex => knex.schema.dropTableIfExists('bananas')
