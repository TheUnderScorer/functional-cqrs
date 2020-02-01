// @ts-nocheck
/* eslint-disable */
const { name } = require('./package.json');

try {
  require('./build');
} catch {
  console.log(
    `🚨  \x1b[31mLooks like "${name}" is not yet build. Please run "\x1b[4myarn\x1b[0m\x1b[31m".`
  );
}
