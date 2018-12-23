const config = require('../../.dockestrc')

const postgresConfig = {
  development: {
    username: config.postgres[0].username,
    password: config.postgres[0].password,
    database: config.postgres[0].db,
    host: config.postgres[0].host,
    port: config.postgres[0].port,
    dialect: 'postgres',
  },
  test: {
    username: config.postgres[0].username,
    password: config.postgres[0].password,
    database: config.postgres[0].db,
    host: config.postgres[0].host,
    port: config.postgres[0].port,
    dialect: 'postgres',
  },
  production: {
    username: config.postgres[0].username,
    password: config.postgres[0].password,
    database: config.postgres[0].db,
    host: config.postgres[0].host,
    port: config.postgres[0].port,
    dialect: 'postgres',
  },
}

module.exports = postgresConfig
