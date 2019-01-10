const { knex1 } = require('../../env')

const dbConfig = {
  client: 'postgresql',
  connection: {
    host: knex1.host,
    database: knex1.db,
    user: knex1.username,
    password: knex1.password,
    port: knex1.port,
  },
  migrations: {
    directory: '../migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: '../seeders',
  },
}

module.exports = dbConfig
