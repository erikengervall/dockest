const db = require('./postgres/models')
const { seedUser } = require('./fixture')

const getFirstDbEntry = async () =>
  db.UserModel.findOne({
    where: {
      email: seedUser.email,
    },
    returning: true,
  })

const main = async (key, value) => {
  const firstEntry = await getFirstDbEntry()

  return {
    [key]: value,
    firstEntry,
  }
}

module.exports = main
