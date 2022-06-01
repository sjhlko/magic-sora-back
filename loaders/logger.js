import winston from 'winston';

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};
winston.addColors(colors);

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.errors({ stack: true }),
    winston.format.printf(
      info => `${info.timestamp} [ ${info.level} ] ${info.message}`,
    ),
  ),
  transports: [],
});
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize()),
    }),
  );
}

logger.stream = {
  write: message => {
    logger.info(message);
  },
};

export default logger;
