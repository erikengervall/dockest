import main from './app'

describe('postgres-1-sequelize', () => {
  it('trabajo', async () => {
    const result = await main()

    expect(result).toEqual(
      expect.objectContaining({
        kafka: expect.any(Object),
      })
    )
  })
})
