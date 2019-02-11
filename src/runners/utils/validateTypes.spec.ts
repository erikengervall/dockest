import { LOG_LEVEL } from '../../constants'
import validateTypes from './validateTypes'

let config: any

describe('validateTypes', () => {
  beforeEach(() => {
    config = {
      service: 'username',
      commands: ['first command', 'second command'],
      variousStuff: ['first command', 1, () => ({})],
      port: 1337,
      ports: [1337, 1338],
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
        variousStuff: validateTypes.isArray,
        port: validateTypes.isNumber,
        ports: validateTypes.isArrayOfType(validateTypes.isNumber),
        autoCreateTopics: validateTypes.isBoolean,
        portMapping: validateTypes.isObjectOfType(validateTypes.isString),
        logLevel: validateTypes.isOneOf(Object.values(LOG_LEVEL)),
      }

      const failures = validateTypes(validationSchema, config)

      expect(failures).toEqual([])
    })
  })

  describe('sad', () => {
    it(`should return a failure right away if there's no config`, () => {
      const failures = validateTypes({}, undefined)

      expect(failures.length).toEqual(1)
      expect(failures[0]).toMatch(/No config found/)
    })

    it(`should return a failure for invalid config`, () => {
      config.service = 1
      const validationSchema = {
        service: validateTypes.isString,
      }

      const failures = validateTypes(validationSchema, config)

      expect(failures.length).toEqual(1)
      expect(failures[0]).toMatch(/service: Expected string | Received number/)
    })
  })
})
