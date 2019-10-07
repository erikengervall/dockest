const config = {
  username: 'ramda',
  password: 'is',
  database: 'nobueno',
  host: 'localhost',
  port: 5422,
  dialect: 'postgres',
  logging: false,
}

const postgresConfig = {
  development: {
    ...config,
  },
  test: {
    ...config,
  },
  production: {
    ...config,
  },
}

module.exports = postgresConfig
