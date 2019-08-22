const { app } = require('./app') // eslint-disable-line @typescript-eslint/no-var-requires

describe('project-2', () => {
  it('should run test', () => {
    const result = app(1, 2)

    expect(result).toEqual(1 - 2)
  })
})
