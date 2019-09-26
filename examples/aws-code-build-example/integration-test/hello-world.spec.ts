import http from 'http'
import fetch from 'node-fetch'
import isDocker from 'is-docker'

const TARGET_HOST = isDocker() ? 'website' : 'localhost'

// hostname is either our docker container hostname or if not run inside a docker container the docker host
const HOSTNAME = isDocker() ? process.env.HOSTNAME : 'host.docker.internal'
const PORT = 8080

let server: http.Server

afterEach(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close(err => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }
})

test('can send a request to the container and it can send a request to us', async done => {
  await new Promise(resolve => {
    server = http
      .createServer((_req, res) => {
        res.write('Hello World!')
        res.end()
        done()
      })
      .listen(PORT, () => {
        console.log(`Serving on http://${HOSTNAME}:${PORT}`)
        resolve()
      })
  })

  const res = await fetch(`http://${TARGET_HOST}:9000`, {
    method: 'post',
    body: `http://${HOSTNAME}:${PORT}`,
  }).then(res => res.text())
  expect(res).toEqual('OK.')
})
