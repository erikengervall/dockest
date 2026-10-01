/**
 * Quote a value for safe interpolation into a POSIX shell command, e.g. a path that contains spaces.
 */
export const shellQuote = (value: string): string => `'${value.replace(/'/g, `'\\''`)}'`;
