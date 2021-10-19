module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint', 'jest'],
  env: {
    commonjs: true,
    es6: true,
    node: true,
    'jest/globals': true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  ignorePatterns: ['src/test/fixtures'],
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.ts'] }],
    'max-len': [0],
    'import/prefer-default-export': ['off'],
    'object-curly-newline': ['off'],
    '@typescript-eslint/no-use-before-define': ['off'],
    'no-await-in-loop': ['off'],
    'operator-linebreak': ['off'],
    'no-underscore-dangle': ['off'],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
    react: {
      version: 'detect',
    },
  },
};
