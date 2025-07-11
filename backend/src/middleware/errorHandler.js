/**
 * Error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Default error
  let error = {
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong'
  };

  // Validation errors
  if (err.name === 'ValidationError') {
    error.error = 'Validation Error';
    error.details = Object.values(err.errors).map(val => val.message);
    return res.status(400).json(error);
  }

  // Cast errors
  if (err.name === 'CastError') {
    error.error = 'Resource not found';
    return res.status(404).json(error);
  }

  // Duplicate key errors
  if (err.code === 11000) {
    error.error = 'Duplicate field value';
    return res.status(400).json(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.error = 'Invalid token';
    return res.status(401).json(error);
  }

  // Rate limit errors
  if (err.status === 429) {
    error.error = 'Too many requests';
    return res.status(429).json(error);
  }

  // Blockchain/contract errors
  if (err.message && err.message.includes('revert')) {
    error.error = 'Smart contract execution failed';
    error.reason = err.reason || 'Transaction reverted';
    return res.status(400).json(error);
  }

  // Network errors
  if (err.code === 'NETWORK_ERROR') {
    error.error = 'Network connection failed';
    return res.status(503).json(error);
  }

  // Default to 500 server error
  res.status(err.statusCode || 500).json(error);
};

/**
 * 404 Not Found middleware
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
};
