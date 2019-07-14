export const ICONS = {
  DEBUG: '🐛',
  LOADING: '⏳',
  SUCCESS: '✅',
  ERROR: '❌',
  STOPPED: '🛑',
  WARN: '⚠️',
  INFO: 'ℹ️',
}

export const COLORS = {
  MISC: {
    RESET: '\x1b[0m',
    BRIGHT: '\x1b[1m',
    DIM: '\x1b[2m',
    UNDERSCORE: '\x1b[4m',
    BLINK: '\x1b[5m',
    REVERSE: '\x1b[7m',
    HIDDEN: '\x1b[8m',
  },
  FG: {
    BLACK: '\x1b[30m',
    RED: '\x1b[31m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    MAGENTA: '\x1b[35m',
    CYAN: '\x1b[36m',
    WHITE: '\x1b[37m',
  },
  BG: {
    BLACK: '\x1b[40m',
    RED: '\x1b[41m',
    GREEN: '\x1b[42m',
    YELLOW: '\x1b[43m',
    BLUE: '\x1b[44m',
    MAGENTA: '\x1b[45m',
    CYAN: '\x1b[46m',
    WHITE: '\x1b[47m',
  },
}

export const LOG_SYMBOLS = [
  '🦊 ',
  '🐼 ',
  '🐒 ',
  '🦋 ',
  '🦄 ',
  '🐥 ',
  '🐙 ',
  '🦖 ',
  '🐞 ',
  '🦂 ',
  '🦍 ',
  '🦃 ',
  '🐿 ',
  '🐉 ',
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
  composeFileName: 'docker-compose.yml',
  dev: {
    debug: false,
  },
  dumpErrors: false,
  exitHandler: null,
  logLevel: LOG_LEVEL.INFO,
  runInBand: true,
}
