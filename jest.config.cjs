module.exports = {
  testEnvironment: 'node',
  testRunner: 'jest-circus/runner',
  setupFilesAfterEnv: ['allure-jest/setup'],
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: 'coverage',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'junit',
        outputName: 'junit.xml',
      },
    ],
  ],
};
