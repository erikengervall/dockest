/* eslint-disable @typescript-eslint/ban-ts-ignore */

import yaml from 'js-yaml'
import generateComposeFile from './generateComposeFile'
import testUtils from '../testUtils'

const {
  createDockestConfig,
  initializedRunners,
  runners: { GeneralPurposeRunner },
} = testUtils({})

describe('generateComposeFile', () => {
  const yamlMock: any = {
    safeDump: jest.fn(json => yaml.safeDump(json)),
  }
  const fsMock: any = {
    writeFileSync: jest.fn(),
  }

  beforeEach(() => {
    yamlMock.safeDump.mockClear()
    fsMock.writeFileSync.mockClear()
  })

  it('should handle the standard initializedRunners', () => {
    const dockestConfig = createDockestConfig({
      runners: Object.values(initializedRunners),
    })

    generateComposeFile(dockestConfig, yamlMock, fsMock)

    expect(yamlMock.safeDump).toMatchSnapshot()
    expect(fsMock.writeFileSync).toHaveBeenCalledTimes(1)
  })

  it('should handle runners with networks prop', () => {
    const dockestConfig = createDockestConfig({
      runners: [
        new GeneralPurposeRunner({
          service: 'networks1',
          image: 'some/thing:101',
          networks: ['bueno'],
          ports: { networks1: 'networks1' },
        }),
        new GeneralPurposeRunner({
          service: 'networks2',
          image: 'some/thing:101',
          networks: ['bueno'],
          ports: { networks2: 'networks2' },
        }),
      ],
    })

    generateComposeFile(dockestConfig, yamlMock, fsMock)

    expect(yamlMock.safeDump).toMatchSnapshot()
    expect(fsMock.writeFileSync).toHaveBeenCalledTimes(1)
  })

  it('should handle runners with build prop', () => {
    const dockestConfig = createDockestConfig({
      runners: [
        new GeneralPurposeRunner({
          service: 'build1',
          build: './some/path',
          ports: { build1: 'build1' },
        }),
        new GeneralPurposeRunner({
          service: 'build2',
          build: './some/path',
          ports: { build1: 'build2' },
        }),
      ],
    })

    generateComposeFile(dockestConfig, yamlMock, fsMock)

    expect(yamlMock.safeDump).toMatchSnapshot()
    expect(fsMock.writeFileSync).toHaveBeenCalledTimes(1)
  })
})
