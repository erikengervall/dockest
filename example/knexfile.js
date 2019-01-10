const {
  postgres2knex: { host, database, username, password, port },
} = require('./env')

const dbConfig = {
  client: 'postgresql',
  connection: {
    host,
    database,
    user: username,
    password,
    port,
  },
  migrations: {
    directory: './postgres-2-knex/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './postgres-2-knex/seeders',
  },
}

module.exports = dbConfig
