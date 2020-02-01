/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const { pathsToModuleNameMapper } = require('ts-jest/utils');
// @ts-ignore
const { compilerOptions } = require('./tsconfig.json');
// @ts-ignore
const { workspaces } = require('./package.json');

/** Test directories */
const IGNORED_ROOTS = [];
const rootDirs = workspaces
  .map(ws => ws.replace('/*', ''))
  .filter(ws => !IGNORED_ROOTS.includes(ws));

module.exports = {
  // Setup
  // ---------------
  preset: 'ts-jest',

  // Paths
  // ---------------
  roots: rootDirs.map(dir => `<rootDir>/${dir}`),
  testMatch: ['**/*.spec.ts?(x)'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),

  // Coverage
  // ---------------
  collectCoverageFrom: [
    `packages/*/src/*.ts`,

    /**
     * Ignore
     * - type definition files
     * - index files (they're just used for better export)
     */
    '!**/{*.d.ts,index.ts}',

    // Ignore node_modules and build folders
    '!**/node_modules/**',
    '!**/build/**',
  ],

  globals: {
    // Ts-jest configuration
    // ---------------
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
  testRunner: 'jest-circus/runner',
};
