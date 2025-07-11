import winston from 'winston';

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

/**
 * Create a Winston logger instance
 */
export const createLogger = () => {
  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
      errors({ stack: true }),
      timestamp(),
      json()
    ),
    defaultMeta: { service: 'createx-backend' },
    transports: [
      new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5
      }),
      new winston.transports.File({ 
        filename: 'logs/combined.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5
      })
    ]
  });

  // Add console transport for development
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: combine(
        colorize(),
        simple()
      )
    }));
  }

  return logger;
};

export default createLogger;
