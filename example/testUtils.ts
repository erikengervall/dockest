const skip = () => describe.skip('', () => it('is skipped'))

export const runOrSkip = (enabled: string, specWrapper: () => void) =>
  enabled === 'true' ? specWrapper() : skip()
