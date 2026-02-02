import React from 'react'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '../ErrorBoundary'

// 抛出错误的测试组件
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // 抑制控制台错误输出
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('应该正常渲染子组件', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('应该在错误发生时显示错误UI', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('出现了一些问题')).toBeInTheDocument()
    expect(screen.getByText(/抱歉，应用遇到了一个错误/)).toBeInTheDocument()
  })

  it('应该显示重试和返回首页按钮', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('重试')).toBeInTheDocument()
    expect(screen.getByText('返回首页')).toBeInTheDocument()
  })

  it('应该在开发环境显示错误详情', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/Test error/)).toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })
})
