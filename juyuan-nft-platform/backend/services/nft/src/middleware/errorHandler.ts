import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // 默认错误
  let statusCode = 500;
  let message = 'Internal server error';
  let details = err.message;

  // 自定义错误类型处理
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    error: message,
    message: details,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  });
};


