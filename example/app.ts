// @ts-ignore
import { seedBanana, seedUser } from './fixture.json'
import postgres1sequelize from './postgres-1-sequelize/models'
import postgres2knex from './postgres-2-knex/models'

const getFirstPostgres1Entry = async () =>
  postgres1sequelize.UserModel.findOne({ where: { email: seedUser.email }, returning: true })

const getFirstPostgres2Entry = async () =>
  postgres2knex('bananas')
    .where({ size: seedBanana.size })
    .first()

const main = async (key: string, value: string) => {
  const firstPostgres1Entry = await getFirstPostgres1Entry()
  const firstPostgres2Entry = await getFirstPostgres2Entry()

  return {
    [key]: value,
    firstPostgres1Entry,
    firstPostgres2Entry,
  }
}

export default main
