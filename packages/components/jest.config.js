const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '\\.css$': '<rootDir>/../../__mocks__/styleMock.js',
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/styleMock.js',
    },
    modulePathIgnorePatterns: ['/icon/', '/.out/'],
    transformIgnorePatterns: ['/node_modules/(?!(@deriv-com/ui)).+\\.js$'],
};
