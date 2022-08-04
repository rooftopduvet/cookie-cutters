import winston from 'winston';
import morgan, { StreamOptions } from 'morgan';

/**
 * ---------------------------------------
 * Winston config
 * ---------------------------------------
 */

const logsDir = process.env.LOGS_DIR || `${process.cwd()}/logs`;

const config: winston.LoggerOptions = {
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'expression' },
  transports: [],
};

if (process.env.NODE_ENV !== 'production') {
  config.transports = [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ];
} else {
  config.transports = [
    new winston.transports.File({ filename: `${logsDir}/error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${logsDir}/combined.log` }),
  ];
}

export const logger = winston.createLogger(config);

/**
 * ---------------------------------------
 * Morgan config
 * ---------------------------------------
 */

const streamOptions: StreamOptions = {
  write: (message) => logger.info(message),
};

export const loggerMiddleware = morgan(
  'combined',
  { stream: streamOptions },
);
