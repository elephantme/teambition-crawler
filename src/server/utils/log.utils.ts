import { createLogger, format, transports } from 'winston';

const myFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp}-[${level}]: ${message}`;
});

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    myFormat,
  ),
  transports: [new transports.Console()],
});

export default logger;
