// Sentry 错误监控配置
// 可选：安装 @sentry/nextjs 以启用错误监控
// npm install @sentry/nextjs
//
// 注意：此文件不会自动执行，需要手动调用 initSentry()
// 如果不需要 Sentry，可以删除此文件

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
  // 注意：这会在运行时检查，不会在构建时失败
  Promise.resolve().then(async () => {
    try {
      const Sentry = await import('@sentry/nextjs');
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
    } catch (error) {
      // Sentry 包未安装，静默跳过
      // 这是正常的，Sentry 是可选的
    }
  });
}

// 注意：不再自动执行，避免构建时检查
// 如果需要启用 Sentry，请在需要的地方手动调用 initSentry()
