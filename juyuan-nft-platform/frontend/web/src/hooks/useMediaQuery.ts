'use client';

import { useState, useEffect } from 'react';

/**
 * 媒体查询Hook
 * 监听媒体查询状态变化
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 使用 addEventListener 代替 addListener（已弃用）
    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}

/**
 * 预定义的响应式断点
 */
export function useBreakpoint() {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isSm = useMediaQuery('(min-width: 640px)');
  const isMd = useMediaQuery('(min-width: 768px)');
  const isLg = useMediaQuery('(min-width: 1024px)');
  const isXl = useMediaQuery('(min-width: 1280px)');
  const is2Xl = useMediaQuery('(min-width: 1536px)');

  return {
    isMobile,
    isTablet: isSm && !isLg,
    isDesktop: isLg,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    current: is2Xl ? '2xl' : isXl ? 'xl' : isLg ? 'lg' : isMd ? 'md' : isSm ? 'sm' : 'xs',
  };
}

/**
 * 暗色模式Hook
 */
export function useDarkMode() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDark, setIsDark] = useState(false);
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 检查本地存储的偏好
    const stored = localStorage.getItem('theme');
    if (stored) {
      setIsDark(stored === 'dark');
      setIsManual(true);
    } else {
      setIsDark(prefersDark);
    }
  }, [prefersDark]);

  const toggle = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    setIsManual(true);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
    
    // 更新 document class
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const reset = () => {
    setIsManual(false);
    setIsDark(prefersDark);
    localStorage.removeItem('theme');
    
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return { isDark, toggle, reset, isManual };
}

/**
 * 减少动画偏好Hook
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

