module.exports = {
  inputFiles: [
    './src/core',
    './src/decorators',
    './src/typings',
    './src/buses',
  ],
  out: 'docs',
  mode: 'file',
  exclude: ['**/*+(index|.spec|.e2e|test).ts', '**/__test__/**'],
  excludeNotExported: true,
  stripInternal: true,
  excludeExternals: true,
};
