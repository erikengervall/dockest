import { getUserNameById, getOrdersByUserId, notFound } from './index'

describe('index.spec.js', () => {
  describe('getUserNameById', () => {
    describe('happy', () => {
      it(`get user by id`, async () => {
        const userResponse = await getUserNameById('1')

        expect(userResponse.status).toEqual(200)
        expect(userResponse.data).toEqual({ id: '1', name: 'John Doe' })
      })
    })

    describe('sad', () => {
      it(`should throw 404 when querying user that doesn't exist`, async () => {
        try {
          await getUserNameById('4')
          throw new Error(`Guarantees failure`)
        } catch (error) {
          expect((error as any).response.status).toEqual(404)
          expect((error as any).response.data).toEqual('Could not find user')
        }
      })
    })
  })

  describe('getOrdersByUserId', () => {
    describe('happy', () => {
      it(`get user's orders`, async () => {
        const ordersResponse = await getOrdersByUserId('1')

        expect(ordersResponse.status).toEqual(200)
        expect(ordersResponse.data).toEqual({ orders: [{ id: '1', name: 'An awesome product', userId: '1' }] })
      })
    })
  })

  describe('misc', () => {
    it(`should throw 404 when querying undeclared endpoint`, async () => {
      try {
        await notFound()
        throw new Error(`Guarantees failure`)
      } catch (error) {
        expect((error as any).response.status).toEqual(404)
      }
    })
  })
})
