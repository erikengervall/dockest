export const USERS = [
  {
    id: '1',
    name: 'John Doe',
  },
  {
    id: '2',
    name: 'Johnny Doey',
  },
]

export const ORDERS = USERS.map((user, index) => ({
  userId: user.id,
  id: index + 1,
  name: `A very nice product #${index + 1}`,
}))
