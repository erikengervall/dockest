import Dockest, { logLevel, runners } from '../../src'

const { SimpleRunner } = runners

const nodeDepRunner = new SimpleRunner({
  service: 'nodeDepRunner',
  ports: {
    '1337': '8080',
  },
  image: null,
  environment: {
    build: './node-dependency',
  },
})

const dockest = new Dockest({
  jest: {
    lib: require('jest'),
  },
  opts: {
    logLevel: logLevel.DEBUG,
    dumpErrors: true,
  },
  runners: [nodeDepRunner],
})

dockest.run()
