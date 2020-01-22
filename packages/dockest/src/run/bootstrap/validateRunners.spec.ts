import { validateRunners } from './validateRunners'
import { createRunner } from '../../test-utils'
import { RunnersObj } from '../../@types'

describe('validateRunners', () => {
  describe('happy', () => {
    it(`should work when there's at least one runner without dependencies`, () => {
      const runners: RunnersObj = {
        node: createRunner(),
      }

      expect(() => validateRunners(runners)).not.toThrow()
    })
  })

  describe('sad', () => {
    it(`should fail when there's no runners without dependencies`, () => {
      const runners: RunnersObj = {}

      expect(() => validateRunners(runners)).toThrow('Failed to create at least one runner without dependencies')
    })
  })
})
