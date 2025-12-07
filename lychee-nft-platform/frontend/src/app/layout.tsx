import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/contexts/AuthContext'
import { Web3Provider } from '@/hooks/useWeb3'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '钜园农业NFT预售平台 - Juyuan Agriculture NFT Platform',
  description: '区块链赋能优质农产品，连接生产者与消费者',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AuthProvider>
          <Web3Provider>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
              <Navbar />
              <main className="pt-16">
                {children}
              </main>
            </div>
          </Web3Provider>
        </AuthProvider>
      </body>
    </html>
  )
}

