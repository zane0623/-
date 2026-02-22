// Sentry 错误监控配置
// 可选：安装 @sentry/nextjs 以启用错误监控
// npm install @sentry/nextjs

export function initSentry() {
  // 只在有 DSN 时才尝试初始化
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return;
  }

  // 仅在客户端执行
  if (typeof window === 'undefined') {
    return;
  }

  // 使用动态导入，如果包未安装则静默失败
  import('@sentry/nextjs')
    .then((Sentry) => {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        debug: process.env.NODE_ENV === 'development',
        beforeSend(event: any) {
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
    })
    .catch(() => {
      // Sentry 包未安装，静默跳过
      // 这是正常的，Sentry 是可选的
    });
}

// 在应用启动时调用（仅在客户端）
if (typeof window !== 'undefined') {
  initSentry();
}
