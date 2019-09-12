import * as dockestExports from './index'

const { default: Dockest, runners } = dockestExports

describe('Dockest', () => {
  it('should export the expected members', () => {
    expect(dockestExports).toMatchSnapshot()
  })

  it('should be initializable and expose the main run method', () => {
    const { GeneralPurposeRunner } = runners
    const generalPurposeRunner = new GeneralPurposeRunner({
      service: '_',
      image: '_',
    })

    const dockest = new Dockest({
      runners: [generalPurposeRunner],
    })

    expect(dockest).toBeInstanceOf(Dockest)
    expect(dockest).toMatchSnapshot()
  })
})
