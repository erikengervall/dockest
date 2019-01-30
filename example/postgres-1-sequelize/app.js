const { seedUser } = require('./data.json')
const postgres1sequelize = require('./models')

const getFirstEntry = async () =>
  postgres1sequelize.UserModel.findOne({
    where: {
      email: seedUser.email,
    },
    returning: true,
  })

const main = async () => {
  const firstEntry = await getFirstEntry()

  return {
    firstEntry,
  }
}

module.exports = main
