import Knex from 'knex'

const knexConfig = require('../../knexfile.js') // eslint-disable-line @typescript-eslint/no-var-requires

const knex = Knex({
  client: knexConfig.client,
  connection: {
    host: knexConfig.connection.host,
    user: knexConfig.connection.user,
    password: knexConfig.connection.password,
    database: knexConfig.connection.database,
    port: knexConfig.connection.port,
  },
})

export default knex
