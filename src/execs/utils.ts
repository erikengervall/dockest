import net from 'net'

const sleep = (ms: number = 1000): Promise<number> =>
  new Promise(resolve => setTimeout(resolve, ms))

const acquireConnection = (host: string = 'localhost', port: number): Promise<void> =>
  new Promise((resolve, reject) => {
    let connected: boolean = false
    let timeoutId: any = null

    const netSocket = net
      .createConnection({ host, port })
      .on('connect', () => {
        clearTimeout(timeoutId)
        console.log('*** connected to server!') // tslint:disable-line
        connected = true
        netSocket.end()
        resolve()
      })
      .on('error', () => {
        connected = false
      })

    timeoutId = setTimeout(
      () => !connected && reject(new Error('Timeout while acquiring connection')),
      1000
    )
  })

export { sleep, acquireConnection }
