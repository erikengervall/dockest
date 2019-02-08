module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      diagnostics: false, // https://huafu.github.io/ts-jest/user/config/diagnostics
    },
  },
}
