exports.init = function init() {
  const log4js = require('log4js');

  log4js.configure({
    appenders: {
      stdout: {
        type: 'stdout',
      },
    },
    categories: {
      default: {
        appenders: [
          'stdout',
        ],
        level: 'debug',
      },
      access: {
        appenders: [
          'stdout',
        ],
        level: 'info',
      },
    }
  });

  return log4js;
};