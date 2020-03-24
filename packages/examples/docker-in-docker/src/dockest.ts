import { Dockest, logLevel } from 'dockest'

const { run } = new Dockest({
  dumpErrors: true,
  jestLib: require('jest'),
  logLevel: logLevel.DEBUG,
})

run([{ serviceName: 'docker_in_docker_website' }])
