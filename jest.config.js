/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */

module.exports = {
  preset: 'ts-jest',

  testMatch: ['**/*.test.ts?(x)'],

  collectCoverageFrom: [
    `*/src/*.ts`,
    '!**/{*.d.ts,index.ts}',
    '!**/node_modules/**',
    '!/build/**',
  ],

  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
};
