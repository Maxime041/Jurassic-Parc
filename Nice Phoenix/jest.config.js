module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
    testTimeout: 30000,
    collectCoverageFrom: [
      'src/Model/**/*.js',
      '!src/tests/**'
    ]
  };