module.exports = {
  parser: '@typescript-eslint/parser',
  root: true,
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:import/errors', // https://github.com/benmosher/eslint-plugin-import
    'plugin:import/warnings', // https://github.com/benmosher/eslint-plugin-import
    'plugin:import/typescript', // https://github.com/benmosher/eslint-plugin-import
    'prettier',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: ['@typescript-eslint', 'no-only-tests'],
  parserOptions: {
    ecmaVersion: 2019, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      modules: true,
    },
  },
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    'no-console': 'warn',

    'no-only-tests/no-only-tests': 'error',

    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',

    'import/order': ['error', { groups: ['builtin', 'external', 'index', 'sibling', 'parent', 'internal'] }],
    'import/newline-after-import': ['error', { count: 1 }],
  },
}
