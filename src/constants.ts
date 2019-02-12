const ICONS: { [key: string]: string } = {
  VERBOSE: '🗣 ',
  LOADING: '⏳',
  SUCCESS: '✅',
  FAILED: '🔥',
  ERROR: '❌',
  STOPPED: '🛑',
  WARNING: '⚠️',
  INFO: 'ℹ️',
  t: '2',
  tt: '2',
  ttt: '2',
}

const COLORS: {
  [key: string]: {
    [key2: string]: string
  }
} = {
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

const defaultDockerComposeRunOpts = Object.values({
  // cleanUp: '--rm',
  runInBackground: '--detach',
  doNotRunLinkedServices: '--no-deps',
}).join(' ')

const LOG_LEVEL = {
  NOTHING: 0,
  ERROR: 1,
  NORMAL: 2,
  VERBOSE: 3,
}

export { ICONS, COLORS, defaultDockerComposeRunOpts, LOG_LEVEL }
