/* eslint-disable @typescript-eslint/ban-ts-ignore */

import GeneralPurposeRunner from './index'

const generalPurposeRunner1 = new GeneralPurposeRunner({ service: 'r1', image: 'some/image:123' })
const generalPurposeRunner2 = new GeneralPurposeRunner({ service: 'r2', image: 'some/image:123' })

describe('GeneralPurposeRunner', () => {
  it('should create unique instances', () => {
    expect(generalPurposeRunner1).not.toBe(generalPurposeRunner2)
  })

  it('should fail validation', () => {
    // @ts-ignore
    expect(() => new GeneralPurposeRunner({})).toThrow(/service: Schema-key missing in config/)
  })
})
