// Sentry 错误监控配置
// 安装: npm install @sentry/nextjs

import * as Sentry from '@sentry/nextjs';

export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      debug: process.env.NODE_ENV === 'development',
      beforeSend(event, hint) {
        // 在生产环境中过滤敏感信息
        if (process.env.NODE_ENV === 'production') {
          // 移除敏感数据
          if (event.request) {
            delete event.request.cookies;
            delete event.request.headers?.['authorization'];
          }
        }
        return event;
      },
    });
  }
}

// 在应用启动时调用
if (typeof window !== 'undefined') {
  initSentry();
}
