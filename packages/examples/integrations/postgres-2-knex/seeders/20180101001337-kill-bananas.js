const seed = knex => knex('bananas').del()

module.exports = {
  seed,
}
