const getKeyForVal = (haystack: { [key: string]: string }, needle: string) =>
  Object.entries(haystack).find(([, value]) => value === needle)

export { getKeyForVal }
