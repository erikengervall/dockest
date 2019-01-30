const main = require('./app')

describe('kafka-1-kafkajs', () => {
  it('trabajo', async () => {
    const result = await main()

    expect(result).toEqual(
      expect.objectContaining({
        kafka: expect.any(Object),
      })
    )
  })
})
