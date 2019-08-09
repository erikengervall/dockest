import app from './app'

describe('project2', () => {
  it('should run test', async () => {
    const result = app(1, 2)

    expect(result).toEqual(1 + 2)
  })
})
