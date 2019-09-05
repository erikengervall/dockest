import { getUserNameById, getOrdersByUserId, notFound } from './index'

describe('index.spec.js', () => {
  describe('getUserNameById', () => {
    describe('happy', () => {
      it(`get user's name by id`, async () => {
        const userResponse = await getUserNameById('1')

        expect(userResponse.status).toEqual(200)
        expect(userResponse.data).toEqual('John Doe')
      })
    })

    describe('sad', () => {
      it(`should throw 404 when querying user that doesn't exist`, async () => {
        try {
          await getUserNameById('4')
          throw new Error(`Just in case above line doesn't throw - this will`)
        } catch (error) {
          expect(error.response.status).toEqual(404)
          expect(error.response.data).toEqual('Could not find user')
        }
      })
    })
  })

  describe('getOrdersByUserId', () => {
    describe('happy', () => {
      it(`get user's orders`, async () => {
        const ordersResponse = await getOrdersByUserId('2')

        expect(ordersResponse.status).toEqual(200)
        expect(ordersResponse.data).toEqual({
          orders: [
            { id: '2', name: 'An awesome product #2', userId: '2' },
            { id: '4', name: 'An awesome product #4', userId: '2' },
            { id: '6', name: 'An awesome product #6', userId: '2' },
            { id: '8', name: 'An awesome product #8', userId: '2' },
            { id: '10', name: 'An awesome product #10', userId: '2' },
          ],
        })
      })
    })

    describe('sad', () => {
      it(`should throw 404 when querying user with no orders`, async () => {
        try {
          await getOrdersByUserId('3')
          throw new Error(`Just in case above line doesn't throw - this will`)
        } catch (error) {
          expect(error.response.status).toEqual(404)
          expect(error.response.data).toEqual('Could not find orders')
        }
      })
    })
  })

  describe('misc', () => {
    it(`should throw 404 when querying undeclared endpoint`, async () => {
      try {
        await notFound()
        throw new Error(`Just in case above line doesn't throw - this will`)
      } catch (error) {
        expect(error.response.status).toEqual(404)
      }
    })
  })
})
