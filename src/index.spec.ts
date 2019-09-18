import * as dockestExports from './index'

const { default: Dockest, runners } = dockestExports

describe('Dockest', () => {
  it('should export the expected members', () => {
    expect(dockestExports).toMatchSnapshot()
  })

  it('should be initializable and expose the main run method', () => {
    const dockest = new Dockest({
      runners: [
        new runners.GeneralPurposeRunner({
          service: '_',
          image: '_',
        }),
      ],
    })

    expect(dockest).toBeInstanceOf(Dockest)
    expect(dockest).toMatchSnapshot()
  })
})
