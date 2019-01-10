const Sequelize = require('sequelize')

const knexConfig = require('../config/knexConfig.js')

const config = knexConfig

const knex = require('knex')({
  client: knexConfig.client,
  connection: {
    host: knexConfig.connection.host,
    user: knexConfig.connection.user,
    password: knexConfig.connection.password,
    database: knexConfig.connection.database,
    port: knexConfig.connection.port,
  },
})

module.exports = knex
