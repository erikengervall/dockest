const env = require('../../env')

const postgresConfig = {
  development: {
    username: env.postgres1.username,
    password: env.postgres1.password,
    database: env.postgres1.db,
    host: env.postgres1.host,
    port: env.postgres1.port,
    dialect: 'postgres',
  },
  test: {
    username: env.postgres1.username,
    password: env.postgres1.password,
    database: env.postgres1.db,
    host: env.postgres1.host,
    port: env.postgres1.port,
    dialect: 'postgres',
  },
  production: {
    username: env.postgres1.username,
    password: env.postgres1.password,
    database: env.postgres1.db,
    host: env.postgres1.host,
    port: env.postgres1.port,
    dialect: 'postgres',
  },
}

module.exports = postgresConfig
