import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://juyuan-nft-web.vercel.app'),
  title: '钜园农业NFT平台 - 优质农产品数字化',
  description: '基于区块链技术的农产品NFT平台，预购优质农产品，获得数字资产所有权',
  keywords: '农产品NFT,区块链,预售,溯源,数字资产',
  authors: [{ name: '钜园农业' }],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
  },
  openGraph: {
    title: '钜园农业NFT平台',
    description: '基于区块链技术的农产品NFT平台',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://juyuan-nft-web.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: '钜园农业NFT平台',
    description: '基于区块链技术的农产品NFT平台',
  },
};

// 主题初始化脚本，防止闪烁
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // system theme
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        }
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}


