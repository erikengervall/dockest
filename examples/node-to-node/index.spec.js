const app = require('./index') // eslint-disable-line @typescript-eslint/no-var-requires

describe('index.spec.js', () => {
  it('should work', async () => {
    const response = await app()

    expect(response.data).toEqual('DEPENDENCY SERVICE app says hi')
  })
})
