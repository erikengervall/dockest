const dotenv = require('dotenv')
const env = dotenv.config().parsed

const postgresConfig = {
  development: {
    username: env.postgres1sequelize_username,
    password: env.postgres1sequelize_password,
    database: env.postgres1sequelize_database,
    host: env.postgres1sequelize_host,
    port: Number(env.postgres1sequelize_port),
    dialect: 'postgres',
    logging: false,
  },
  test: {
    username: env.postgres1sequelize_username,
    password: env.postgres1sequelize_password,
    database: env.postgres1sequelize_database,
    host: env.postgres1sequelize_host,
    port: Number(env.postgres1sequelize_port),
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: env.postgres1sequelize_username,
    password: env.postgres1sequelize_password,
    database: env.postgres1sequelize_database,
    host: env.postgres1sequelize_host,
    port: Number(env.postgres1sequelize_port),
    dialect: 'postgres',
    logging: false,
  },
}

module.exports = postgresConfig
