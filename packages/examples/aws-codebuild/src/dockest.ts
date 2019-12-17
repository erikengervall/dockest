import { Dockest, logLevel } from 'dockest'

const dockest = new Dockest({
  dumpErrors: true,
  logLevel: logLevel.DEBUG,
})

dockest.run([
  {
    serviceName: 'aws_codebuild_website',
  },
])
