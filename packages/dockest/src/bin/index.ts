#!/usr/bin/env node

import fs from 'fs'
import yargs from 'yargs'

import { Dockest } from '../index'
import { DockestService } from '../@types'

const { argv } = yargs
  .array('testPathIgnorePatterns')
  .array('testPathPattern')
  .alias('testPathPattern', 'files')
  .boolean('alwaysRecreateDeps')
  .boolean('build')
  .boolean('debug')
  .boolean('dumpErrors')
  .boolean('forceRecreate')
  .boolean('jestRunInBand')
  .boolean('noBuild')
  .boolean('noColor')
  .boolean('noDeps')
  .boolean('noRecreate')
  .boolean('quietPull')
  .boolean('runInBand')
  .boolean('updateSnapshot')
  .alias('updateSnapshot', 'u')
  .boolean('verbose')
  .number('logLevel')
  .number('testTimeout')
  .string('composeFile')
  .string('testNamePattern')

const {
  alwaysRecreateDeps,
  build,
  composeFile,
  debug,
  dumpErrors,
  forceRecreate,
  jestRunInBand,
  logLevel,
  noBuild,
  noColor,
  noDeps,
  noRecreate,
  quietPull,
  runInBand,
  testPathPattern,
  testNamePattern,
  testPathIgnorePatterns,
  testTimeout,
  verbose,
  updateSnapshot,
} = argv

console.table(argv)

const { run } = new Dockest({
  composeFile,
  composeOpts: {
    alwaysRecreateDeps,
    build,
    forceRecreate,
    noBuild,
    noColor,
    noDeps,
    noRecreate,
    quietPull,
  },
  debug,
  dumpErrors,
  logLevel,
  runInBand,

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  jestOpts: {
    runInBand: jestRunInBand,
    testNamePattern,
    testPathIgnorePatterns,
    testPathPattern,
    testTimeout,
    updateSnapshot,
    verbose,
  },
})

const services: string[] = fs.readFileSync('.dockest', { encoding: 'utf8' }).split('\n')

const bin = async () => {
  await run(
    services.map(service => {
      const [serviceName, resource] = service.split(',')

      return {
        serviceName,
        healthcheck: async ({ defaultHealthchecks: { postgres, redis, web } }) => {
          if (resource === 'postgres') await postgres()
          if (resource === 'redis') await redis()
          if (resource === 'web') await web()
        },
      } as DockestService
    }),
  )
}

bin()
