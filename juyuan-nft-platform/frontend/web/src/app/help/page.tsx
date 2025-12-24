'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  Search, 
  Wallet, 
  ShoppingCart, 
  Truck, 
  Shield, 
  HelpCircle,
  MessageCircle,
  FileText,
  Zap,
  Globe,
  Lock
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: '入门指南',
    question: '什么是钜园农业NFT平台？',
    answer: '钜园农业NFT平台是全球首创的区块链农产品溯源预售平台。通过NFT技术，将优质农产品数字化，让每一份农产品都有可追溯的数字身份，确保从农场到餐桌的全程透明。'
  },
  {
    category: '入门指南',
    question: '如何开始使用平台？',
    answer: '1. 首先安装MetaMask或其他Web3钱包\n2. 点击"连接钱包"按钮连接您的钱包\n3. 浏览预售市场选择心仪的农产品\n4. 完成支付即可获得NFT凭证\n5. 收获季节凭NFT兑换实物农产品'
  },
  {
    category: '钱包相关',
    question: '支持哪些钱包？',
    answer: '我们支持主流的Web3钱包，包括：MetaMask、WalletConnect、Coinbase Wallet、Rainbow等。推荐使用MetaMask，它是最流行且安全的以太坊钱包。'
  },
  {
    category: '钱包相关',
    question: '如何安装MetaMask钱包？',
    answer: '1. 访问 metamask.io 官网\n2. 下载对应浏览器的扩展程序\n3. 按照提示创建新钱包或导入已有钱包\n4. 妥善保管您的助记词，切勿泄露给任何人'
  },
  {
    category: '购买流程',
    question: 'NFT预售如何运作？',
    answer: '预售期间，您可以以优惠价格购买农产品NFT。每个NFT代表一定数量的实物农产品。当农产品成熟收获后，您可以凭NFT兑换实物，或在二级市场交易您的NFT。'
  },
  {
    category: '购买流程',
    question: '支持哪些支付方式？',
    answer: '目前支持ETH和MATIC支付。我们即将支持更多稳定币（USDT、USDC）以及法币支付渠道（微信、支付宝）。'
  },
  {
    category: '配送物流',
    question: '农产品如何配送？',
    answer: '收获季节到来后，我们会通过顺丰冷链配送到您指定的地址。全程温度监控，确保新鲜直达。您可以在"我的NFT"页面查看配送状态。'
  },
  {
    category: '配送物流',
    question: '配送范围是哪些地区？',
    answer: '目前支持中国大陆地区配送（新疆、西藏、青海等偏远地区除外）。国际配送服务即将开通，敬请期待。'
  },
  {
    category: '安全保障',
    question: '我的资金安全吗？',
    answer: '绝对安全！我们采用智能合约托管机制，您的资金在购买后会进入托管合约，只有在您确认收货后才会释放给农户。如有任何问题，可申请退款。'
  },
  {
    category: '安全保障',
    question: '如何确保农产品质量？',
    answer: '每个农产品NFT都包含完整的溯源信息：产地、种植时间、农户信息、质量检测报告等。所有数据上链不可篡改，您可以随时查询验证。'
  },
  {
    category: '溯源查询',
    question: '如何查询产品溯源信息？',
    answer: '在导航栏点击"溯源查询"，输入您的NFT编号或扫描产品上的二维码，即可查看从种植到配送的全部信息，包括每个环节的时间、地点和操作人员。'
  },
  {
    category: '退款售后',
    question: '可以申请退款吗？',
    answer: '在以下情况可以申请退款：\n1. 预售未达到最低目标\n2. 农产品未能按时交付\n3. 收到的产品与描述严重不符\n退款会原路返回到您的钱包。'
  },
];

const categories = [
  { id: 'all', name: '全部问题', icon: HelpCircle },
  { id: '入门指南', name: '入门指南', icon: Zap },
  { id: '钱包相关', name: '钱包相关', icon: Wallet },
  { id: '购买流程', name: '购买流程', icon: ShoppingCart },
  { id: '配送物流', name: '配送物流', icon: Truck },
  { id: '安全保障', name: '安全保障', icon: Shield },
  { id: '溯源查询', name: '溯源查询', icon: Globe },
  { id: '退款售后', name: '退款售后', icon: Lock },
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-6">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">帮助中心</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              有什么可以<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">帮助您？</span>
            </h1>
            
            <p className="text-slate-400 text-lg mb-10">
              搜索常见问题，或浏览分类找到您需要的答案
            </p>

            {/* 搜索框 */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索问题..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 分类标签 */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* FAQ 列表 */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-slate-400 text-lg">没有找到相关问题</p>
              <p className="text-slate-500 text-sm mt-2">试试其他关键词或浏览全部分类</p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 text-sm font-bold">
                      Q
                    </span>
                    <span className="text-white font-medium pr-4">{faq.question}</span>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <div className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center text-teal-400 text-sm font-bold">
                        A
                      </span>
                      <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* 联系我们 */}
      <section className="bg-slate-800/30 border-t border-slate-700/50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              还没找到答案？
            </h2>
            <p className="text-slate-400">通过以下方式联系我们的客服团队</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* 在线客服 */}
            <div className="bg-slate-900/50 rounded-2xl p-6 text-center hover:bg-slate-800/50 transition-colors border border-slate-700/50">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">在线客服</h3>
              <p className="text-slate-400 text-sm mb-4">工作日 9:00-18:00</p>
              <button className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors">
                立即咨询
              </button>
            </div>

            {/* 邮件支持 */}
            <div className="bg-slate-900/50 rounded-2xl p-6 text-center hover:bg-slate-800/50 transition-colors border border-slate-700/50">
              <div className="w-14 h-14 bg-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-teal-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">邮件支持</h3>
              <p className="text-slate-400 text-sm mb-4">24小时内回复</p>
              <a 
                href="mailto:support@juyuan.com"
                className="block w-full py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors"
              >
                发送邮件
              </a>
            </div>

            {/* 社群支持 */}
            <div className="bg-slate-900/50 rounded-2xl p-6 text-center hover:bg-slate-800/50 transition-colors border border-slate-700/50">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">社群支持</h3>
              <p className="text-slate-400 text-sm mb-4">加入官方社群</p>
              <button className="w-full py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors">
                加入Discord
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



