'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-white mb-4">页面未找到</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          抱歉，您访问的页面不存在。可能已被移动或删除。
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
          >
            <Home className="w-5 h-5" />
            返回首页
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回上页
          </button>
        </div>
      </div>
    </div>
  );
}
