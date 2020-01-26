import isDocker from 'is-docker' // eslint-disable-line import/default
import jest from 'jest'
import { DockestOpts } from '../@types'
import { LOG_LEVEL, DEFAULT_HOST_NAME } from '../constants'

export const getOpts = (opts: Partial<DockestOpts> = {}) => {
  const {
    composeFile = 'docker-compose.yml',
    composeOpts: {
      alwaysRecreateDeps = false,
      build = false,
      forceRecreate = false,
      noBuild = false,
      noColor = false,
      noDeps = false,
      noRecreate = false,
      quietPull = false,
    } = {},
    debug = false || process.argv.includes('dev') || process.argv.includes('debug'),
    dumpErrors = false,
    exitHandler = async () => Promise.resolve(),
    jestLib = jest,
    jestOpts,
    jestOpts: { projects = ['.'], runInBand: runInBandJest = true } = {},
    logLevel = LOG_LEVEL.INFO,
    runInBand = true,
  } = opts

  return {
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
    exitHandler,
    hostname: process.env.HOSTNAME || DEFAULT_HOST_NAME,
    isInsideDockerContainer: isDocker(),
    jestLib,
    jestOpts: {
      projects,
      runInBand: runInBandJest,
      ...jestOpts,
    },
    jestRanWithResult: false,
    logLevel,
    perfStart: Date.now(),
    runInBand,
  }
}
