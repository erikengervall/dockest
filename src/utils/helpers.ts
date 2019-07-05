const { keys } = Object

const getKeyForVal = (haystack: { [key: string]: string }, needle: string): string | undefined =>
  keys(haystack).find(key => haystack[key] === needle)

export { getKeyForVal }
