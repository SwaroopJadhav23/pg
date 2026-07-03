export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, req, res, next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier';
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = 'Duplicate resource already exists';
  }

  if (error.name === 'ValidationError') {
    statusCode = 422;
    message = Object.values(error.errors).map((item) => item.message).join(', ');
  }

  const requestId = req.id;

  if (statusCode >= 500) {
    console.error({ requestId, message, stack: error.stack });
  }

  res.status(statusCode).json({
    success: false,
    message,
    requestId,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
  });
}
