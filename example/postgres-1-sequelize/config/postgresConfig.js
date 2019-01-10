const {
  postgres1sequelize: { username, password, database, host, port },
} = require('../../env')

const postgresConfig = {
  development: {
    username,
    password,
    database,
    host,
    port,
    dialect: 'postgres',
  },
  test: {
    username,
    password,
    database,
    host,
    port,
    dialect: 'postgres',
  },
  production: {
    username,
    password,
    database,
    host,
    port,
    dialect: 'postgres',
  },
}

module.exports = postgresConfig
