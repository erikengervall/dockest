export const USERS = [
  {
    id: '1',
    name: 'John Doe',
  },
  {
    id: '2',
    name: 'Johnny Doey',
  },
  {
    id: '3',
    name: 'Johanna Dou',
  },
]

export const ORDERS = Array.from(Array(10), (_, index) => ({
  userId: `${USERS[index % 2].id}`,
  id: `${index + 1}`,
  name: `An awesome product #${index + 1}`,
}))
