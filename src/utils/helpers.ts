const { keys } = Object

const getKeyForVal = (haystack: { [key: string]: string }, needle: string): string | undefined =>
  keys(haystack).find(key => haystack[key] === needle)

const trim = (str: string): string => str.replace(/\s+/g, '').trim()

export { getKeyForVal, trim }
