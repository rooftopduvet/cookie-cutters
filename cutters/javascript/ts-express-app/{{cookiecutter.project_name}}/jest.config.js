module.exports = {
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/tests/__mocks__/objectMock.js',
    '\\.(png|jpg|jpeg|svg|gif|tiff|bmp)$': '<rootDir>/tests/__mocks__/objectMock.js',
  },
  testPathIgnorePatterns: [
    '<rootDir>/dist/',
  ],
};
