import path from 'path'
import Dockest, { logLevel, runners } from '../../src'

const { GeneralPurposeRunner } = runners

const nodeDepRunner = new GeneralPurposeRunner({
  service: 'node_dep_runner',
  ports: { '1337': '8080' },
  props: {
    build: path.resolve(__dirname, './node-dependency'),
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
