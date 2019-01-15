const postgres1sequelize = require('./postgres-1-sequelize/models')
const postgres2knex = require('./postgres-2-knex/models')
const { redis: redis1ioredis, redisKey } = require('./redis1')
const { seedUser, seedBanana } = require('./fixture')

const getFirstPostgres1Entry = async () =>
  postgres1sequelize.UserModel.findOne({ where: { email: seedUser.email }, returning: true })

const getFirstPostgres2Entry = async () =>
  postgres2knex('bananas')
    .where({ size: seedBanana.size })
    .first()

const getRedis1Entry = () => redis1ioredis.get(redisKey)

const main = async (key, value) => {
  redis1ioredis.set(redisKey, '1337')

  const firstPostgres1Entry = await getFirstPostgres1Entry()
  const firstPostgres2Entry = await getFirstPostgres2Entry()
  const redis1Entry = getRedis1Entry()

  return {
    [key]: value,
    firstPostgres1Entry,
    firstPostgres2Entry,
  }
}

module.exports = main
