import postgres1sequelize from './models'

const seedUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'demo@demo.com',
}

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
