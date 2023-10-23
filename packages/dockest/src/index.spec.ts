import * as allTheStuff from './index'

describe('index', () => {
  describe('happy', () => {
    it('should match expected interface', () => {
      expect(allTheStuff).toMatchInlineSnapshot(`
        {
          "Dockest": [Function],
          "execa": [Function],
          "logLevel": {
            "DEBUG": 4,
            "ERROR": 1,
            "INFO": 3,
            "NOTHING": 0,
            "WARN": 2,
          },
          "sleep": [Function],
          "sleepWithLog": [Function],
        }
      `)
    })

    it('should be able to instantiate Dockest without options', () => {
      new allTheStuff.Dockest()
    })
  })
})
