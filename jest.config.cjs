module.exports = {
  testEnvironment: 'allure-jest/node',
  testRunner: 'jest-circus/runner',
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: 'coverage',
  testEnvironmentOptions: {
    resultsDir: 'allure-results',
  },
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
