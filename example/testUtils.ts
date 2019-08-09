const skip = () => describe.skip('', () => it('should be skipped'))

export const runOrSkip = (enabled: string, specWrapper: () => void) => (enabled === 'true' ? specWrapper() : skip())
