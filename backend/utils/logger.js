const chalk = require('chalk');

const info = (...params) => {
  console.log(chalk.green(...params));
};

const warn = (...params) => {
  console.warn(chalk.yellow(...params));
};

const error = (...params) => {
  console.error(chalk.red(...params));
};

module.exports = {
  info,
  warn,
  error,
};
