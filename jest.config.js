module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'ts'],
  roots: ['src'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['./src/**/*.ts', '!./src/test/fixtures/**/*'],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
