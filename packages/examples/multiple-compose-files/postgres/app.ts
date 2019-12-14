import { db } from './models'

const seedUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'demo@demo.com',
}

const getFirstEntry = async () =>
  db.UserModel.findOne({
    where: {
      email: seedUser.email,
    },
    returning: true,
  })

export const app = async () => {
  const firstEntry = await getFirstEntry()

  return {
    firstEntry,
  }
}
