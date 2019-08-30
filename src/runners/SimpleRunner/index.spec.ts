import SimpleRunner from './index'

const SimpleRunner1 = new SimpleRunner({ service: 'r1' })
const SimpleRunner2 = new SimpleRunner({ service: 'r2' })

describe('SimpleRunner', () => {
  it('should create unique instances', () => {
    expect(SimpleRunner1).not.toBe(SimpleRunner2)
  })

  it('should fail validation', () => {
    expect(
      () =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        new SimpleRunner({}),
    ).toThrow(/service: Schema-key missing in config/)
  })
})
