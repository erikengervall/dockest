/* eslint-disable @typescript-eslint/no-explicit-any */

import { COLORS } from '../constants'

const { keys, values } = Object

interface Obj {
  [key: string]: any
}
type isType = (_?: any) => boolean

const {
  FG: { RED, GREEN },
  MISC: { RESET },
} = COLORS

const getExpected = (typeValidator: any): string =>
  typeValidator.expected || typeValidator.name.substring(2).toLowerCase()

const getReceived = (value: any): string => (isArray(value) ? `${typeof value[0]}[]` : `${value} (${typeof value})`)

const validateTypes = (schema?: Obj, config?: Obj): string[] => {
  const failures: string[] = []

  if (!schema) {
    failures.push(`${RED}Missing validation schema${RESET}`)
    return failures
  }

  if (!config) {
    failures.push(`${RED}Missing config to validate${RESET}`)
    return failures
  }

  keys(schema).forEach(schemaKey => {
    const value = config[schemaKey]

    if (value) {
      const typeValidatorFn = schema[schemaKey]

      // TODO: Allow sending multiple things
      // if (isArray(typeValidatorFn)) {
      // }

      if (typeValidatorFn(value) === false) {
        const expected = `${RED}Expected${RESET} ${getExpected(typeValidatorFn)}`
        const received = `${GREEN}Received${RESET} ${getReceived(value)}`

        failures.push(`${schemaKey}${RESET}: ${expected} | ${received}`)
      }
    } else {
      failures.push(`${RED}${schemaKey}${RESET}: Schema-key missing in config`)
    }
  })

  return failures
}

const isString: isType = _ => (_ && typeof _ === 'string') || _ instanceof String
const isNumber: isType = _ => _ && typeof _ === 'number' && isFinite(_)
const isArray = (_?: any): boolean => _ && typeof _ === 'object' && _.constructor === Array
const isArrayOfType = (fn: isType) => {
  const isArrayOfType = (_?: any): boolean => isArray(_) && !_.some((_?: any) => !fn(_))
  isArrayOfType.expected = `${fn.name.substring(2).toLowerCase()}[]`
  return isArrayOfType
}
const isFunction: isType = _ => _ && typeof _ === 'function'
const isObject: isType = _ => _ && typeof _ === 'object' && _.constructor === Object
const isObjectWithValuesOfType = (fn: isType) => {
  const isObjectWithValuesOfType = (_?: any): boolean => isObject(_) && !values(_).some((_?: any) => !fn(_))
  isObjectWithValuesOfType.expected = `{ [prop: string]: ${fn.name.substring(2).toLowerCase()} }`
  return isObjectWithValuesOfType
}
const isNull: isType = _ => _ === null
const isUndefined: isType = _ => typeof _ === 'undefined'
const isBoolean: isType = _ => _ && typeof _ === 'boolean'
const isRegExp: isType = _ => _ && typeof _ === 'object' && _.constructor === RegExp
const isError: isType = _ => _ && _ instanceof Error && typeof _.message !== 'undefined'
const isDate: isType = _ => _ && _ instanceof Date
const isSymbol: isType = _ => _ && typeof _ === 'symbol'
const isAny: isType = _ => _ && !isNull(_) && !isUndefined(_)
const isOneOf = (haystack: any[]) => {
  const isOneOf = (needle: any): boolean => isArray(haystack) && !!haystack.find(_ => _ === needle)
  isOneOf.expected = `oneOf [${haystack.join(', ')}]`
  return isOneOf
}
const OR = 'OR'
const AND = 'AND'

validateTypes.isString = isString
validateTypes.isNumber = isNumber
validateTypes.isArray = isArray
validateTypes.isArrayOfType = isArrayOfType
validateTypes.isFunction = isFunction
validateTypes.isObject = isObject
validateTypes.isObjectWithValuesOfType = isObjectWithValuesOfType
validateTypes.isNull = isNull
validateTypes.isUndefined = isUndefined
validateTypes.isBoolean = isBoolean
validateTypes.isRegExp = isRegExp
validateTypes.isError = isError
validateTypes.isDate = isDate
validateTypes.isSymbol = isSymbol
validateTypes.isAny = isAny
validateTypes.isOneOf = isOneOf
validateTypes.OR = OR
validateTypes.AND = AND

export default validateTypes
