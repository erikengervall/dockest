import * as allTheStuff from './index'

describe('index', () => {
  describe('happy', () => {
    it('should match expected interface', () => {
      expect(allTheStuff).toMatchInlineSnapshot(`
        Object {
          "Dockest": [Function],
          "defaultHealthchecks": Object {
            "postgres": [Function],
            "redis": [Function],
            "web": [Function],
          },
          "execa": [Function],
          "logLevel": Object {
            "DEBUG": 4,
            "ERROR": 1,
            "INFO": 3,
            "NOTHING": 0,
            "WARN": 2,
          },
        }
      `)
    })
  })
})
