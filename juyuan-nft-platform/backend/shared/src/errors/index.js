"use strict";
// ========================================
// 钜园农业NFT平台 - 自定义错误类
// ========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.KYCRequiredError = exports.InvalidSignatureError = exports.InsufficientBalanceError = exports.PresaleSoldOutError = exports.PresaleEndedError = exports.PresaleNotStartedError = exports.NFTNotFoundError = exports.PresaleNotFoundError = exports.UserNotFoundError = exports.InternalError = exports.RateLimitError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.AppError = void 0;
exports.isAppError = isAppError;
exports.isOperationalError = isOperationalError;
const constants_1 = require("../constants");
class AppError extends Error {
    constructor(code, message, statusCode = 500, isOperational = true, details) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// 400 Bad Request
class BadRequestError extends AppError {
    constructor(message = '请求参数错误', details) {
        super(constants_1.ERROR_CODES.INVALID_PARAMS.code, message, 400, true, details);
    }
}
exports.BadRequestError = BadRequestError;
// 401 Unauthorized
class UnauthorizedError extends AppError {
    constructor(message = '未授权访问') {
        super(constants_1.ERROR_CODES.UNAUTHORIZED.code, message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
// 403 Forbidden
class ForbiddenError extends AppError {
    constructor(message = '禁止访问') {
        super(constants_1.ERROR_CODES.FORBIDDEN.code, message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
// 404 Not Found
class NotFoundError extends AppError {
    constructor(resource = '资源') {
        super(constants_1.ERROR_CODES.NOT_FOUND.code, `${resource}不存在`, 404);
    }
}
exports.NotFoundError = NotFoundError;
// 409 Conflict
class ConflictError extends AppError {
    constructor(message = '资源冲突') {
        super('CONFLICT', message, 409);
    }
}
exports.ConflictError = ConflictError;
// 429 Too Many Requests
class RateLimitError extends AppError {
    constructor(message = '请求过于频繁，请稍后再试') {
        super(constants_1.ERROR_CODES.RATE_LIMITED.code, message, 429);
    }
}
exports.RateLimitError = RateLimitError;
// 500 Internal Server Error
class InternalError extends AppError {
    constructor(message = '服务器内部错误') {
        super(constants_1.ERROR_CODES.UNKNOWN_ERROR.code, message, 500, false);
    }
}
exports.InternalError = InternalError;
// 业务错误类
class UserNotFoundError extends NotFoundError {
    constructor() {
        super('用户');
        // @ts-ignore - readonly property assignment in constructor
        this.code = constants_1.ERROR_CODES.USER_NOT_FOUND.code;
    }
}
exports.UserNotFoundError = UserNotFoundError;
class PresaleNotFoundError extends NotFoundError {
    constructor() {
        super('预售');
        // @ts-ignore - readonly property assignment in constructor
        this.code = constants_1.ERROR_CODES.PRESALE_NOT_FOUND.code;
    }
}
exports.PresaleNotFoundError = PresaleNotFoundError;
class NFTNotFoundError extends NotFoundError {
    constructor() {
        super('NFT');
        // @ts-ignore - readonly property assignment in constructor
        this.code = constants_1.ERROR_CODES.NFT_NOT_FOUND.code;
    }
}
exports.NFTNotFoundError = NFTNotFoundError;
class PresaleNotStartedError extends BadRequestError {
    constructor() {
        super(constants_1.ERROR_CODES.PRESALE_NOT_STARTED.message);
        // @ts-ignore - readonly property assignment in constructor
        this.code = constants_1.ERROR_CODES.PRESALE_NOT_STARTED.code;
    }
}
exports.PresaleNotStartedError = PresaleNotStartedError;
class PresaleEndedError extends BadRequestError {
    constructor() {
        super(constants_1.ERROR_CODES.PRESALE_ENDED.message);
        // @ts-ignore - readonly property assignment in constructor
        this.code = constants_1.ERROR_CODES.PRESALE_ENDED.code;
    }
}
exports.PresaleEndedError = PresaleEndedError;
class PresaleSoldOutError extends BadRequestError {
    constructor() {
        super(constants_1.ERROR_CODES.PRESALE_SOLD_OUT.message);
        // @ts-ignore - readonly property assignment in constructor
        this.code = constants_1.ERROR_CODES.PRESALE_SOLD_OUT.code;
    }
}
exports.PresaleSoldOutError = PresaleSoldOutError;
class InsufficientBalanceError extends BadRequestError {
    constructor() {
        super(constants_1.ERROR_CODES.INSUFFICIENT_BALANCE.message);
        // @ts-ignore - readonly property assignment in constructor
        this.code = constants_1.ERROR_CODES.INSUFFICIENT_BALANCE.code;
    }
}
exports.InsufficientBalanceError = InsufficientBalanceError;
class InvalidSignatureError extends UnauthorizedError {
    constructor() {
        super(constants_1.ERROR_CODES.INVALID_SIGNATURE.message);
        // @ts-ignore - readonly property assignment in constructor
        this.code = constants_1.ERROR_CODES.INVALID_SIGNATURE.code;
    }
}
exports.InvalidSignatureError = InvalidSignatureError;
class KYCRequiredError extends ForbiddenError {
    constructor() {
        super(constants_1.ERROR_CODES.KYC_REQUIRED.message);
        // @ts-ignore - readonly property assignment in constructor
        this.code = constants_1.ERROR_CODES.KYC_REQUIRED.code;
    }
}
exports.KYCRequiredError = KYCRequiredError;
// 错误处理工具函数
function isAppError(error) {
    return error instanceof AppError;
}
function isOperationalError(error) {
    if (isAppError(error)) {
        return error.isOperational;
    }
    return false;
}
//# sourceMappingURL=index.js.map