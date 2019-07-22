const { keys } = Object

export default (haystack: { [key: string]: string }, needle: string): string | undefined =>
  keys(haystack).find(key => haystack[key] === needle)
