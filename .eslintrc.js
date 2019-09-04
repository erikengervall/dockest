module.exports = {
  parser: '@typescript-eslint/parser',
  root: true,
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier',
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'plugin:import/errors', // https://github.com/benmosher/eslint-plugin-import
    'plugin:import/warnings', // https://github.com/benmosher/eslint-plugin-import
    'plugin:import/typescript', // https://github.com/benmosher/eslint-plugin-import
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2019, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: false,
    },
    // project: [require('path').resolve(__dirname, './tsconfig.json')],
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
  },
  rules: {
    'no-console': 'error',

    // Typescript
    // "@typescript-eslint/indent": ["error", 2, { "VariableDeclarator": 2 }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    // Import
    'import/order': ['error', { groups: ['builtin', 'external', 'index', 'sibling', 'parent', 'internal'] }],
    'import/newline-after-import': ['error', { count: 1 }],

    // "quotemark": 0
    // "object-literal-sort-keys": 0,
    // "interface-name": [2, "never-prefix"],
    // "semicolon": 0,
    // "member-access": 0,
    // "no-shadowed-variable": 0,
    // "no-unused-variable": 2,
    // "trailing-comma": [2, { "multiline": { "arguments": "never" } }],
    // "no-duplicate-variable": 2,
    // "max-line-length": 0,
    // "interface-over-type-literal": 0,
    // "no-submodule-imports": [2, ["src"]],
    // "no-implicit-dependencies": [2, "dev"]
  },
}

/*
https://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments
*/
