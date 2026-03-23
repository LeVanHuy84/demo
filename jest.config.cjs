module.exports = {
  testEnvironment: 'allure-jest/node',
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
    [
      'allure-jest/reporter',
      {
        resultsDir: 'allure-results',
        suiteTitle: true,
      },
    ],
  ],
};
