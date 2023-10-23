import readline from 'readline';
import { greenBright, redBright, yellowBright } from 'chalk';
import { LOG_LEVEL } from './constants';

interface LoggerPayload {
  data?: {
    [key: string]: any;
  };
  endingNewLines?: number;
  service?: string;
  startingNewLines?: number;
  success?: boolean;
  symbol?: string;
}

export type LogMethod = (message: string, payload?: LoggerPayload) => void;

const getLogArgs = (message: string, payload: LoggerPayload): string[] => {
  const { data = undefined, service, symbol, endingNewLines = 0, startingNewLines = 0, success } = payload;
  let logArgs: string[] = [];

  if (startingNewLines > 0) {
    logArgs = logArgs.concat(new Array(startingNewLines).fill('\n'));
  }

  const derivedService = service || 'Dockest';
  const derivedSymbol = symbol || '🌈';
  logArgs.push(`${derivedSymbol} ${derivedService} ${derivedSymbol} ${success ? greenBright(message) : message}`);

  if (data && Logger.logLevel === LOG_LEVEL.DEBUG) {
    logArgs.push(JSON.stringify(data, null, 2));
  }

  if (endingNewLines > 0) {
    logArgs = logArgs.concat(new Array(endingNewLines).fill('\n'));
  }

  return logArgs;
};

export class Logger {
  public static logLevel: number = LOG_LEVEL.INFO;

  public static error: LogMethod = (message, payload = {}) => {
    if (Logger.logLevel >= LOG_LEVEL.ERROR) {
      console.error(...getLogArgs(message, payload).map((logArg) => redBright(logArg))); // eslint-disable-line no-console
    }
  };

  public static warn: LogMethod = (message, payload = {}) => {
    if (Logger.logLevel >= LOG_LEVEL.WARN) {
      console.warn(...getLogArgs(message, payload).map((logArg) => yellowBright(logArg))); // eslint-disable-line no-console
    }
  };

  public static info: LogMethod = (message, payload = {}) => {
    if (Logger.logLevel >= LOG_LEVEL.INFO) {
      console.info(...getLogArgs(message, payload)); // eslint-disable-line no-console
    }
  };

  public static debug: LogMethod = (message, payload = {}) => {
    if (Logger.logLevel >= LOG_LEVEL.DEBUG) {
      console.debug(...getLogArgs(message, payload)); // eslint-disable-line no-console
    }
  };

  public static replacePrevLine = ({ message, isLast = false }: { message: string; isLast?: boolean }) => {
    readline.cursorTo(process.stdout, 0, undefined);
    process.stdout.write(message);

    if (isLast) {
      process.stdout.write('\n\n');
    }
  };

  public static measurePerformance = (perfStart: number, opts: { logPrefix?: string } = {}) => {
    if (perfStart !== 0) {
      const perfTime = Math.floor((Date.now() - perfStart) / 1000);
      let hours: number | string = Math.floor(perfTime / 3600);
      let minutes: number | string = Math.floor((perfTime - hours * 3600) / 60);
      let seconds: number | string = perfTime - hours * 3600 - minutes * 60;

      if (hours < 10) {
        hours = `0${hours}`;
      }
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }

      Logger.info(`${opts.logPrefix || ''} Elapsed time: ${hours}:${minutes}:${seconds}`);
    }
  };

  private serviceName = '';
  private runnerSymbol = '🦇 ';
  public constructor(serviceName?: string) {
    this.serviceName = serviceName || 'UNKNOWN';
  }

  public setRunnerSymbol = (symbol: string) => {
    this.runnerSymbol = symbol;
  };

  public error: LogMethod = (message, payload = {}) =>
    Logger.error(message, { ...payload, service: this.serviceName, symbol: this.runnerSymbol });

  public warn: LogMethod = (message, payload = {}) =>
    Logger.warn(message, { ...payload, service: this.serviceName, symbol: this.runnerSymbol });

  public info: LogMethod = (message, payload = {}) =>
    Logger.info(message, { ...payload, service: this.serviceName, symbol: this.runnerSymbol });

  public debug: LogMethod = (message, payload = {}) =>
    Logger.debug(message, { ...payload, service: this.serviceName, symbol: this.runnerSymbol });
}
