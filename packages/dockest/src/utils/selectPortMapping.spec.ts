import { selectPortMapping } from './selectPortMapping'

describe('selectPortMapping', () => {
  it.each([
    ['1234:1111', { target: 1111, published: 1234 }],
    ['2222:1111', { target: 1111, published: 2222 }],
    ['12:20', { target: 20, published: 12 }],
    ['90:1000', { target: 1000, published: 90 }],
  ])('can parse the string format', (input, expected) => {
    expect(selectPortMapping(input)).toEqual(expected)
  })

  it.each([
    [
      { target: 1234, published: 1111 },
      { target: 1234, published: 1111 },
    ],
    [
      { target: 1111, published: 1234 },
      { target: 1111, published: 1234 },
    ],
    [
      { target: 3333, published: 3333 },
      { target: 3333, published: 3333 },
    ],
  ])('passes through the object format', (input, expected) => {
    expect(selectPortMapping(input)).toEqual(expected)
  })
})
