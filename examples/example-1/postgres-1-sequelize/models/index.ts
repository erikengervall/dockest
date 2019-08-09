import Sequelize from 'sequelize'
import postgresConfig from '../config/postgresConfig.js'

const config = postgresConfig.test
const db: any = {}

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