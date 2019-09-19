module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      diagnostics: false, // https://huafu.github.io/ts-jest/user/config/diagnostics
    },
  },
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: ['./jest.setup.ts'],
}
