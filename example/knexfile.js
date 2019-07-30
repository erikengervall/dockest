const dotenv = require('dotenv') // eslint-disable-line @typescript-eslint/no-var-requires
const env = dotenv.config().parsed

const dbConfig = {
  client: 'postgresql',
  connection: {
    host: env.postgres2knex_host,
    database: env.postgres2knex_database,
    user: env.postgres2knex_username,
    password: env.postgres2knex_password,
    port: Number(env.postgres2knex_port),
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
