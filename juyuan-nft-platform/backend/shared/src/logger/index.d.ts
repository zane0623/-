import winston from 'winston';
export declare function createLogger(service: string): winston.Logger;
export declare function requestLogger(logger: winston.Logger): (req: any, res: any, next: any) => void;
export declare const logger: winston.Logger;
//# sourceMappingURL=index.d.ts.map