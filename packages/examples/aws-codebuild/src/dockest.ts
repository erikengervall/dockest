import { Dockest, logLevel } from 'dockest'

const { run } = new Dockest({
  dumpErrors: true,
  jestLib: require('jest'),
  logLevel: logLevel.DEBUG,
})

run([{ serviceName: 'aws_codebuild_website' }])
