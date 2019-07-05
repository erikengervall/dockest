import getImage from './getImage'

describe('getImage', () => {
  const composeFileName = 'getImage.spec.yml'
  const service = 'getImageService'

  it('should get image from test Compose file', () => {
    const result = getImage({
      composeFileName,
      service,
      mockProcess: { cwd: () => __dirname },
    })

    expect(result).toEqual({ image: 'postgres:9.6' })
  })
})
