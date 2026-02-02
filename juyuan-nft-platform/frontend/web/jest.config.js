const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // 提供 Next.js 应用的路径以加载 next.config.js 和 .env 文件
  dir: './',
})

// 添加任何自定义配置到 Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
}

// createJestConfig 被导出，这样 next/jest 可以加载 Next.js 配置，这是异步的
module.exports = createJestConfig(customJestConfig)
