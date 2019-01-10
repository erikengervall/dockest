const postgres1 = require('./postgres1/models')
const { seedUser } = require('./fixture')

const getFirstPostgres1Entry = async () =>
  postgres1.UserModel.findOne({ where: { email: seedUser.email }, returning: true })

const getFirstPostgres2Entry = async () =>
  postgres2.BananaModel.findOne({ where: { size: seedUser.email }, returning: true })

const main = async (key, value) => {
  const firstPostgres1Entry = await getFirstPostgres1Entry()
  const firstPostgres2Entry = await getFirstPostgres2Entry()

  return {
    [key]: value,
    firstPostgres1Entry,
    firstPostgres2Entry,
  }
}

module.exports = main
