'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton, useAccount } from '@rainbow-me/rainbowkit';
import { Menu, X, ShoppingCart, Leaf, Sparkles, Heart } from 'lucide-react';
import { ThemeToggleSimple } from '@/components/ui/ThemeToggle';
import { SearchBar } from '@/components/SearchBar';
import { NotificationCenter } from '@/components/NotificationCenter';
import { useWishlist } from '@/hooks/useWishlist';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count: wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: '首页', href: '/' },
    { name: '预售市场', href: '/presale' },
    { name: '我的NFT', href: '/my-nfts' },
    { name: '溯源查询', href: '/traceability' },
    { name: '帮助中心', href: '/help' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 shadow-lg shadow-black/10' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container-custom">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300 group-hover:scale-105">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center animate-bounce-soft">
                <Sparkles className="w-2.5 h-2.5 text-amber-900" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-white tracking-tight">
                钜园农业
              </span>
              <span className="text-xs text-emerald-400 font-medium tracking-wider">
                BLOCKCHAIN NFT
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-300 group"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            ))}
            {/* 搜索框 */}
            <SearchBar />
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {/* 主题切换 */}
            <ThemeToggleSimple />
            
            {/* 通知中心 */}
            <NotificationCenter />
            
            {/* 心愿单 */}
            <Link 
              href="/wishlist" 
              className="relative p-3 text-slate-400 hover:text-white transition-colors duration-300 hover:bg-slate-800/50 rounded-xl group"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-lg shadow-emerald-500/50">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            {/* 购物车 */}
            <Link 
              href="/cart" 
              className="relative p-3 text-slate-400 hover:text-white transition-colors duration-300 hover:bg-slate-800/50 rounded-xl group"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-lg shadow-emerald-500/50">
                0
              </span>
            </Link>
            
            {/* 连接钱包按钮 */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
              <ConnectButton.Custom>
                {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                  const ready = mounted;
                  const connected = ready && account && chain;

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        style: {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              className="relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
                            >
                              连接钱包
                            </button>
                          );
                        }

                        return (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={openChainModal}
                              className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-slate-300 hover:border-emerald-500/50 hover:text-white transition-all duration-300"
                            >
                              {chain.hasIcon && chain.iconUrl && (
                                <Image
                                  alt={chain.name ?? 'Chain icon'}
                                  src={chain.iconUrl}
                                  width={16}
                                  height={16}
                                  className="inline mr-2"
                                />
                              )}
                              {chain.name}
                            </button>
                            <button
                              onClick={openAccountModal}
                              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300"
                            >
                              {account.displayName}
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>

          {/* Mobile right side */}
          <div className="flex lg:hidden items-center gap-2">
            {/* 主题切换 */}
            <ThemeToggleSimple />
            
            {/* Mobile menu button */}
            <button
              className="p-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-6 space-y-2 border-t border-slate-800/50">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 px-4">
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
