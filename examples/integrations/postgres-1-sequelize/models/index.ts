import Sequelize from 'sequelize'

const postgresConfig = require('../config/postgresConfig.js') // eslint-disable-line @typescript-eslint/no-var-requires

const config = postgresConfig.test
const db: any = {}

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const sequelize = new Sequelize(config)

const UserModel = sequelize.define(
  'User',
  {
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
  },
  {},
)

db.sequelize = sequelize
db.Sequelize = Sequelize
db.UserModel = UserModel

export default db
