const { pathsToModuleNameMapper } = require('ts-jest');
const tsconfig = require('./tsconfig.json');

module.exports = {
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  testEnvironment: 'jsdom',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/tests/__mocks__/objectMock.js',
    '\\.(png|jpg|jpeg|svg|gif|tiff|bmp)$': '<rootDir>/tests/__mocks__/objectMock.js',
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: '<rootDir>/' }),
  },
};
