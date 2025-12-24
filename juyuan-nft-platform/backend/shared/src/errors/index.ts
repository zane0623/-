// ========================================
// 钜园农业NFT平台 - 自定义错误类
// ========================================

import { ERROR_CODES } from '../constants';

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    code: string,
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request
export class BadRequestError extends AppError {
  constructor(message: string = '请求参数错误', details?: any) {
    super(ERROR_CODES.INVALID_PARAMS.code, message, 400, true, details);
  }
}

// 401 Unauthorized
export class UnauthorizedError extends AppError {
  constructor(message: string = '未授权访问') {
    super(ERROR_CODES.UNAUTHORIZED.code, message, 401);
  }
}

// 403 Forbidden
export class ForbiddenError extends AppError {
  constructor(message: string = '禁止访问') {
    super(ERROR_CODES.FORBIDDEN.code, message, 403);
  }
}

// 404 Not Found
export class NotFoundError extends AppError {
  constructor(resource: string = '资源') {
    super(ERROR_CODES.NOT_FOUND.code, `${resource}不存在`, 404);
  }
}

// 409 Conflict
export class ConflictError extends AppError {
  constructor(message: string = '资源冲突') {
    super('CONFLICT', message, 409);
  }
}

// 429 Too Many Requests
export class RateLimitError extends AppError {
  constructor(message: string = '请求过于频繁，请稍后再试') {
    super(ERROR_CODES.RATE_LIMITED.code, message, 429);
  }
}

// 500 Internal Server Error
export class InternalError extends AppError {
  constructor(message: string = '服务器内部错误') {
    super(ERROR_CODES.UNKNOWN_ERROR.code, message, 500, false);
  }
}

// 业务错误类
export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('用户');
    this.code = ERROR_CODES.USER_NOT_FOUND.code;
  }
}

export class PresaleNotFoundError extends NotFoundError {
  constructor() {
    super('预售');
    this.code = ERROR_CODES.PRESALE_NOT_FOUND.code;
  }
}

export class NFTNotFoundError extends NotFoundError {
  constructor() {
    super('NFT');
    this.code = ERROR_CODES.NFT_NOT_FOUND.code;
  }
}

export class PresaleNotStartedError extends BadRequestError {
  constructor() {
    super(ERROR_CODES.PRESALE_NOT_STARTED.message);
    this.code = ERROR_CODES.PRESALE_NOT_STARTED.code;
  }
}

export class PresaleEndedError extends BadRequestError {
  constructor() {
    super(ERROR_CODES.PRESALE_ENDED.message);
    this.code = ERROR_CODES.PRESALE_ENDED.code;
  }
}

export class PresaleSoldOutError extends BadRequestError {
  constructor() {
    super(ERROR_CODES.PRESALE_SOLD_OUT.message);
    this.code = ERROR_CODES.PRESALE_SOLD_OUT.code;
  }
}

export class InsufficientBalanceError extends BadRequestError {
  constructor() {
    super(ERROR_CODES.INSUFFICIENT_BALANCE.message);
    this.code = ERROR_CODES.INSUFFICIENT_BALANCE.code;
  }
}

export class InvalidSignatureError extends UnauthorizedError {
  constructor() {
    super(ERROR_CODES.INVALID_SIGNATURE.message);
    this.code = ERROR_CODES.INVALID_SIGNATURE.code;
  }
}

export class KYCRequiredError extends ForbiddenError {
  constructor() {
    super(ERROR_CODES.KYC_REQUIRED.message);
    this.code = ERROR_CODES.KYC_REQUIRED.code;
  }
}

// 错误处理工具函数
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function isOperationalError(error: unknown): boolean {
  if (isAppError(error)) {
    return error.isOperational;
  }
  return false;
}



