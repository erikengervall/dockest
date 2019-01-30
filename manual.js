const net = require('net')

const acquireConnection = (port, host = 'localhost') =>
  new Promise((resolve, reject) => {
    let connected = false
    let timeoutId = null

    const netSocket = net
      .createConnection({ host, port })
      .on('connect', () => {
        clearTimeout(timeoutId)
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

const run = async () => {
  const ports = [9092, 9093, 9094, 9082, 2181]
  for (let port of ports) {
    console.log('port', port)
    try {
      await acquireConnection(port)
    } catch (error) {
      console.error('error', error)
    }
  }
}

const run2 = async () => {
  try {
    const a = await acquireConnection(9082)
    console.log('a', a)
  } catch (error) {
    console.error('error', error)
  }
}

// run()
run2()
