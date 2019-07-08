import getPorts from './getPorts'

describe('getPorts', () => {
  it('should properly map ports', () => {
    const ports = {
      1000: '2000',
      1001: '2001',
      1002: '2002',
      anyString: 'works',
    }

    const result = getPorts(ports)

    expect(result).toEqual({
      ports: ['1000:2000', '1001:2001', '1002:2002', 'anyString:works'],
    })
  })
})
