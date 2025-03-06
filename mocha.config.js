module.exports = {
  require: ['ts-node/register'],
  extension: ['ts'],
  spec: 'tests/**/*.test.ts',
  timeout: 5000,
  loader: 'ts-node/esm',
};
