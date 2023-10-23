import { hashCode } from './hash-code'

describe('hashCode', () => {
  describe('happy', () => {
    it('should generate hashCodes deterministically', () => {
      const service = 'postgres1sequelize'
      const service2 = 'postgres1sequelize'

      const result = hashCode(service)
      const result2 = hashCode(service2)

      expect(result).toMatchInlineSnapshot(`-2021595073`)
      expect(result).toEqual(result2)
    })
  })
})
