import validateTypes from './validateTypes'

describe('validateTypes', () => {
  let config: object

  beforeEach(() => {
    config = {
      service: 'username',
      commands: ['first command', 'second command'],
      port: 1337,
      ports: [1337, 1338],
      autoCreateTopics: true,
      portMapping: {
        '1337': '1338',
      },
    }
  })

  describe('happy', () => {
    it('should work for valid config', () => {
      const validationSchema = {
        service: validateTypes.isString,
        commands: validateTypes.isArrayOfType(validateTypes.isString),
        port: validateTypes.isNumber,
        ports: validateTypes.isArrayOfType(validateTypes.isNumber),
        autoCreateTopics: validateTypes.isBoolean,
        portMapping: validateTypes.isObjectOfType(validateTypes.isString),
      }

      expect(validateTypes(validationSchema, config)).toEqual([])
    })
  })

  describe('sad', () => {
    it(`should return a failure right away if there's no config`, () => {
      const failures = validateTypes({}, undefined)

      expect(failures.length).toEqual(1)
      expect(failures[0]).toMatch(/No config found/)
    })
  })
})
