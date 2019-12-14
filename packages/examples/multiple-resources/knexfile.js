const dbConfig = {
  client: 'postgresql',
  connection: {
    host: 'localhost',
    database: 'nobueno',
    user: 'ramda',
    password: 'is',
    port: 5436,
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
