import { DEFAULT_USER_CONFIG } from '../constants'
import getImage from './getImage'

describe('getImage', () => {
  const testComposeFileName = 'getImage.spec.yml'
  const service = 'getImageService'

  describe('without user provided image', () => {
    it('should get image from test Compose file', () => {
      const result = getImage({
        composeFileName: testComposeFileName,
        service,
        mockProcess: { cwd: () => __dirname },
      })

      expect(result).toEqual({
        image: 'postgres:9.6',
      })
    })

    it(`should throw error if Compose file doesn't exist`, () => {
      const invalidComposeFileName = `invalid-${testComposeFileName}`

      const result = () =>
        getImage({
          composeFileName: invalidComposeFileName,
          service,
          mockProcess: { cwd: () => __dirname },
        })

      expect(result).toThrow(`Failed to parse ${invalidComposeFileName}`)
    })
  })

  describe('with user provided image', () => {
    it('should work with valid image', () => {
      const image = 'postgres:9.6'

      const result = getImage({
        composeFileName: DEFAULT_USER_CONFIG.composeFileName,
        service,
        mockProcess: { cwd: () => __dirname },
        image,
      })

      expect(result).toEqual({
        image,
      })
    })
  })
})
