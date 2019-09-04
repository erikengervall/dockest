import getImage from './getImage'
import { DEFAULT_USER_CONFIG } from '../../constants'

describe('getImage', () => {
  const testComposeFileName = 'getImage.spec.yml'
  const service = 'getImageService'
  const props = {}

  describe('without user provided image', () => {
    it('should get image from test Compose file', () => {
      const result = getImage({
        composeFileName: testComposeFileName,
        mockProcess: { cwd: () => __dirname },
        props,
        service,
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
          mockProcess: { cwd: () => __dirname },
          props,
          service,
        })

      expect(result).toThrow(/Failed to parse '\//)
    })
  })

  describe('with user provided image', () => {
    it('should work with valid image', () => {
      const image = 'postgres:9.6'

      const result = getImage({
        composeFileName: DEFAULT_USER_CONFIG.composeFileName,
        image,
        mockProcess: { cwd: () => __dirname },
        props,
        service,
      })

      expect(result).toEqual({
        image,
      })
    })
  })
})
