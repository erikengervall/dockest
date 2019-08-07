import { ObjStrStr } from '../@types'

const { keys } = Object

export default (haystack: ObjStrStr, needle: string): string | undefined =>
  keys(haystack).find(key => haystack[key] === needle)
