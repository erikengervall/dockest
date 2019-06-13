import net from 'net'
import acquireConnection from './acquireConnection'

const host = 'localhost'
const port = 1337

jest.mock('net', () => ({
  createConnection: jest.fn(function(_) {
    // @ts-ignore
    return this
  }),
  on: jest.fn(function(event) {
    if (event === 'connect') {
      //
    } else if (event === 'error') {
      //
    }

    // @ts-ignore
    return this
  }),
}))

// TODO:
describe.skip('acquireConnection', () => {
  it('should acquire connection', async () => {
    await acquireConnection(host, port)

    expect(net.createConnection).toHaveBeenCalled()
  })
})
