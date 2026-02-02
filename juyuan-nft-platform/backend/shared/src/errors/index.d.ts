export declare class AppError extends Error {
    readonly code: string;
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly details?: any;
    constructor(code: string, message: string, statusCode?: number, isOperational?: boolean, details?: any);
}
export declare class BadRequestError extends AppError {
    constructor(message?: string, details?: any);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
export declare class NotFoundError extends AppError {
    constructor(resource?: string);
}
export declare class ConflictError extends AppError {
    constructor(message?: string);
}
export declare class RateLimitError extends AppError {
    constructor(message?: string);
}
export declare class InternalError extends AppError {
    constructor(message?: string);
}
export declare class UserNotFoundError extends NotFoundError {
    constructor();
}
export declare class PresaleNotFoundError extends NotFoundError {
    constructor();
}
export declare class NFTNotFoundError extends NotFoundError {
    constructor();
}
export declare class PresaleNotStartedError extends BadRequestError {
    constructor();
}
export declare class PresaleEndedError extends BadRequestError {
    constructor();
}
export declare class PresaleSoldOutError extends BadRequestError {
    constructor();
}
export declare class InsufficientBalanceError extends BadRequestError {
    constructor();
}
export declare class InvalidSignatureError extends UnauthorizedError {
    constructor();
}
export declare class KYCRequiredError extends ForbiddenError {
    constructor();
}
export declare function isAppError(error: unknown): error is AppError;
export declare function isOperationalError(error: unknown): boolean;
//# sourceMappingURL=index.d.ts.map