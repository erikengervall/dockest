import { LOG_LEVEL } from '../constants'
import validateTypes from './validateTypes'

const { values } = Object

describe('validateTypes', () => {
  let config: {
    [key: string]: any
  }

  beforeEach(() => {
    config = {
      service: 'username',
      commands: ['first command', 'second command'],
      variousStuff: ['first command', 1, () => ({})],
      port: 1337,
      ports: ['1337:1337', '1338:1338'],
      autoCreateTopics: true,
      portMapping: { '1337': '1338' },
      logLevel: 1,
    }
  })

  describe('happy', () => {
    it('should work for valid config', () => {
      const validationSchema = {
        service: validateTypes.isString,
        commands: validateTypes.isArrayOfType(validateTypes.isString),
        variousStuff: validateTypes.isArrayOfType(validateTypes.isAny),
        port: validateTypes.isNumber,
        ports: validateTypes.isArrayOfType(validateTypes.isString),
        autoCreateTopics: validateTypes.isBoolean,
        portMapping: validateTypes.isObjectWithValuesOfType(validateTypes.isString),
        logLevel: validateTypes.isOneOf(values(LOG_LEVEL)),
      }

      const failures = validateTypes(validationSchema, config)

      expect(failures).toEqual([])
    })
  })

  describe('sad', () => {
    it(`should return a failure right away if there's no config`, () => {
      const failures = validateTypes({}, undefined)

      expect(failures.length).toEqual(1)
      expect(failures[0]).toMatch('Missing config to validate')
    })

    it(`should return a failure for invalid config`, () => {
      config.service = 1
      const validationSchema = {
        service: validateTypes.isString,
      }

      const failures = validateTypes(validationSchema, config)

      expect(failures.length).toEqual(1)
      expect(failures[0]).toMatch('service: Expected string | Received 1 (number)')
    })
  })
})
