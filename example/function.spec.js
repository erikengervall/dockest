const main = require('./function')
const { seedUser } = require('./fixture')

describe('main', () => {
  it('should construct an object with key:value as first and second function arguments', async () => {
    const key = 'thisIsAKey'
    const value = 'thisIsAValue'

    const result = await main(key, value)

    expect(result).toEqual(
      expect.objectContaining({
        [key]: value,
        firstEntry: expect.objectContaining(seedUser),
      })
    )
  })
})
