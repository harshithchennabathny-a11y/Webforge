import logger from '../utils/logger.js';

/**
 * HTTP request logger middleware.
 * Logs method, URL, status code, and response time.
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'http';

    logger.log(logLevel, `${req.method} ${req.originalUrl} ${res.statusCode} — ${duration}ms`);
  });

  next();
};

export default requestLogger;
