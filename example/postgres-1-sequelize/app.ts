// @ts-ignore
import { seedUser } from './data.json'
import postgres1sequelize from './models'

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

export default main
