import { getUserNameById, getUserOrdersByUserId } from './index'

describe('index.spec.js', () => {
  it(`get user's name by id`, async () => {
    const response = await getUserNameById('1')

    expect(response.status).toEqual(200)
    expect(response.data).toEqual('John Doe')
  })

  it(`get user's orders`, async () => {
    const response = await getUserOrdersByUserId('2')

    expect(response.status).toEqual(200)
    expect(response.data).toEqual('John Doe')
  })
})
