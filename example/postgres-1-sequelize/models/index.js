const Sequelize = require('sequelize')

const postgresConfig = require('../config/postgresConfig.js')

const config = postgresConfig.test
const db = {}

const sequelize = new Sequelize({
  ...config,
  operatorsAliases: false,
})

const UserModel = sequelize.define(
  'User',
  {
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
  },
  {}
)

db.sequelize = sequelize
db.Sequelize = Sequelize
db.UserModel = UserModel

module.exports = db
