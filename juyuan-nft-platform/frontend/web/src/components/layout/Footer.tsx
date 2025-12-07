'use client';

import Link from 'next/link';
import { Leaf, Mail, Phone, MapPin, Twitter, Github, MessageCircle } from 'lucide-react';

const footerLinks = {
  product: [
    { name: '预售市场', href: '/presale' },
    { name: '我的NFT', href: '/my-nfts' },
    { name: '溯源查询', href: '/trace' },
    { name: '帮助中心', href: '/help' },
  ],
  company: [
    { name: '关于我们', href: '/about' },
    { name: '合作农场', href: '/partners' },
    { name: '新闻动态', href: '/news' },
    { name: '加入我们', href: '/careers' },
  ],
  support: [
    { name: '常见问题', href: '/faq' },
    { name: '用户协议', href: '/terms' },
    { name: '隐私政策', href: '/privacy' },
    { name: '联系客服', href: '/contact' },
  ]
};

export function Footer() {
  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/50 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10">
        {/* 主要内容 */}
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* 品牌信息 */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="block font-bold text-xl text-white">钜园农业</span>
                <span className="block text-xs text-emerald-400">BLOCKCHAIN NFT</span>
              </div>
            </Link>
            
            <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
              全球领先的区块链农产品溯源NFT平台，让每一份农产品都有可追溯的数字身份，为消费者带来安全、放心的优质农产品。
            </p>
            
            {/* 联系信息 */}
            <div className="space-y-3">
              <a href="mailto:contact@juyuan-nft.com" className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors">
                <Mail className="w-5 h-5" />
                <span>contact@juyuan-nft.com</span>
              </a>
              <a href="tel:+86-400-888-8888" className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors">
                <Phone className="w-5 h-5" />
                <span>400-888-8888</span>
              </a>
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin className="w-5 h-5" />
                <span>广东省广州市天河区科技园</span>
              </div>
            </div>
          </div>
          
          {/* 链接列 */}
          <div>
            <h4 className="text-white font-semibold mb-6">产品服务</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-emerald-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">关于我们</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-emerald-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">帮助支持</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-emerald-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* 底部栏 */}
        <div className="py-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 钜园农业科技有限公司. All rights reserved.
          </p>
          
          {/* 社交媒体 */}
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 bg-slate-800/50 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500/50 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-all duration-300">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-slate-800/50 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500/50 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-all duration-300">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-slate-800/50 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500/50 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-all duration-300">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
