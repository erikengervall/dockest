import Knex from 'knex'
import knexConfig from '../../knexfile.js'

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
