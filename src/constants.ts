export const COLORS = {
  MISC: {
    BLINK: '\x1b[5m',
    BRIGHT: '\x1b[1m',
    DIM: '\x1b[2m',
    HIDDEN: '\x1b[8m',
    RESET: '\x1b[0m',
    REVERSE: '\x1b[7m',
    UNDERSCORE: '\x1b[4m',
  },
  FG: {
    BLACK: '\x1b[30m',
    BLUE: '\x1b[34m',
    CYAN: '\x1b[36m',
    GREEN: '\x1b[32m',
    MAGENTA: '\x1b[35m',
    RED: '\x1b[31m',
    WHITE: '\x1b[37m',
    YELLOW: '\x1b[33m',
  },
  BG: {
    BLACK: '\x1b[40m',
    BLUE: '\x1b[44m',
    CYAN: '\x1b[46m',
    GREEN: '\x1b[42m',
    MAGENTA: '\x1b[45m',
    RED: '\x1b[41m',
    WHITE: '\x1b[47m',
    YELLOW: '\x1b[43m',
  },
}

export const LOG_SYMBOLS: readonly string[] = [
  '🐉 ',
  '🐒 ',
  '🐙 ',
  '🐞 ',
  '🐥 ',
  '🐼 ',
  '🐿 ',
  '🦂 ',
  '🦃 ',
  '🦄 ',
  '🦊 ',
  '🦋 ',
  '🦍 ',
  '🦖 ',
  '🦚 ',
]

export const LOG_LEVEL = {
  NOTHING: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
}

export const DEFAULT_USER_CONFIG = {
  afterSetupSleep: 0,
  dev: { debug: false },
  dumpErrors: false,
  exitHandler: null,
  logLevel: LOG_LEVEL.INFO,
  runInBand: true,
  composeFile: [],
  guessRunnerType: false,
}

export const INTERNAL_CONFIG = {
  failedTeardowns: [],
  jestRanWithResult: false,
  perfStart: 0,
}

export const PROCESS_TEST_ENV = 'dockest-test'

export const GENERATED_COMPOSE_FILE_NAME = 'docker-compose.dockest-generated.yml'
export const GENERATED_RUNNER_COMPOSE_FILE_NAME = 'docker-compose.dockest-generated-runner.yml'
export const GENERATED_COMPOSE_FILE_PATH = `${process.cwd()}/${GENERATED_COMPOSE_FILE_NAME}`
export const GENERATED_RUNNER_COMPOSE_FILE_PATH = `${process.cwd()}/${GENERATED_RUNNER_COMPOSE_FILE_NAME}`
