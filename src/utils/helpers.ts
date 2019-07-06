const { keys } = Object

export const getKeyForVal = (
  haystack: { [key: string]: string },
  needle: string
): string | undefined => keys(haystack).find(key => haystack[key] === needle)

export const trim = (str: string): string => str.replace(/\s+/g, ' ').trim()

export const trimNoSpaces = (str: string): string => str.replace(/\s+/g, '').trim()
