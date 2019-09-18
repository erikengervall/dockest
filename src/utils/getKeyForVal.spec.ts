import getKeyForVal from './getKeyForVal'

describe('helpers', () => {
  describe('getKeyForVal', () => {
    it('should return key if value exist on object', () => {
      const haystack = { a: '1', b: '2', c: '3', d: '4', e: '5' }
      const needle = '4'

      const result = getKeyForVal(haystack, needle)

      expect(result).toMatchSnapshot()
    })

    it('should return undefined if value does not exist', () => {
      const haystack = { a: '1', b: '2', c: '3', d: '4', e: '5' }
      const needle = '6'

      const result = getKeyForVal(haystack, needle)

      expect(result).toMatchSnapshot()
    })

    it('should return undefined if value does not exist (2)', () => {
      const haystack = { a: '1', b: '2', c: '3', d: '4', e: '5' }
      const needle = 'c'

      const result = getKeyForVal(haystack, needle)

      expect(result).toMatchSnapshot()
    })
  })
})
