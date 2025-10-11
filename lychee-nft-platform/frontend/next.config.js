/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用React严格模式
  reactStrictMode: true,
  
  // 输出模式（Docker部署使用standalone）
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  // 图片域名白名单
  images: {
    domains: [
      'localhost',
      'lychee-nft.com',
      // 添加其他允许的图片域名
      'ipfs.io',
      'cloudflare-ipfs.com',
    ],
    // 图片优化配置
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // 国际化配置（暂时禁用，避免自动重定向）
  // i18n: {
  //   locales: ['zh-CN', 'zh-TW', 'en', 'th', 'ms', 'vi'],
  //   defaultLocale: 'zh-CN',
  //   localeDetection: false,
  // },
  
  // 环境变量
  env: {
    NEXT_PUBLIC_APP_NAME: 'Lychee NFT Platform',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  
  // Webpack配置
  webpack: (config, { isServer }) => {
    // 解决某些模块的兼容性问题
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
  
  // 编译配置
  compiler: {
    // 移除console.log（仅生产环境）
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // 实验性功能
  experimental: {
    // 启用服务器组件
    serverActions: true,
  },
  
  // 重定向规则
  async redirects() {
    return [
      // 示例：旧URL重定向到新URL
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ];
  },
  
  // 重写规则
  async rewrites() {
    return [
      // API代理（开发环境）
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*',
      },
    ];
  },
  
  // Headers配置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
