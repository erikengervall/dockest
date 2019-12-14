const postgresConfig = {
  development: {
    username: 'ramda',
    password: 'is',
    database: 'nobueno',
    host: 'localhost',
    port: 5435,
    dialect: 'postgres',
    logging: false,
  },
  test: {
    username: 'ramda',
    password: 'is',
    database: 'nobueno',
    host: 'localhost',
    port: 5435,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: 'ramda',
    password: 'is',
    database: 'nobueno',
    host: 'localhost',
    port: 5435,
    dialect: 'postgres',
    logging: false,
  },
}

module.exports = postgresConfig
