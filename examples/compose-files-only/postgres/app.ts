import postgres1sequelize from './models'

const { seedUser } = require('./data.json') // eslint-disable-line @typescript-eslint/no-var-requires

const getFirstEntry = async () =>
  postgres1sequelize.UserModel.findOne({
    where: {
      email: seedUser.email,
    },
    returning: true,
  })

const app = async () => {
  const firstEntry = await getFirstEntry()

  return {
    firstEntry,
  }
}

export default app
