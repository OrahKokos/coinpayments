module.exports = {
  moduleFileExtensions: ['ts'],
  rootDir: '.',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  collectCoverage: true,
  testEnvironment: 'node',
};
