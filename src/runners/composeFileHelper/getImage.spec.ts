import getImage from './getImage'

describe('getImage', () => {
  const service = 'getImageService'

  describe('with user provided image', () => {
    it('should work with valid image', () => {
      const image = 'postgres:9.6'

      const result = getImage({ image, service })

      expect(result).toEqual({ image })
    })
  })

  describe('with user provided build', () => {
    it('should work with valid build', () => {
      const build = './path'

      const result = getImage({ build, service })

      expect(result).toEqual({})
    })
  })
})
