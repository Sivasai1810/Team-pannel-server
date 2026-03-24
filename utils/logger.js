const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logFile = path.join(logsDir, 'app.log');
const errorFile = path.join(logsDir, 'error.log');

const logger = {
  info: (message, meta = {}) => {
    const log = {
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message,
      ...meta
    };
    console.log(JSON.stringify(log));
    fs.appendFileSync(logFile, JSON.stringify(log) + '\n');
  },

  error: (message, error = {}) => {
    const log = {
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message,
      error: error.message || error,
      stack: error.stack
    };
    console.error(JSON.stringify(log));
    fs.appendFileSync(errorFile, JSON.stringify(log) + '\n');
  },

  warn: (message, meta = {}) => {
    const log = {
      level: 'WARN',
      timestamp: new Date().toISOString(),
      message,
      ...meta
    };
    console.warn(JSON.stringify(log));
    fs.appendFileSync(logFile, JSON.stringify(log) + '\n');
  }
};

module.exports = logger;
