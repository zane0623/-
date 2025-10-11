'use client';

import Link from 'next/link';

export default function AboutPage() {
  const team = [
    {
      name: '张伟',
      role: '创始人 & CEO',
      avatar: '👨‍💼',
      description: '15年农业供应链经验，曾任大型农企高管，致力于用区块链技术革新农业产业'
    },
    {
      name: '李娜',
      role: '技术总监 & CTO',
      avatar: '👩‍💻',
      description: '前阿里巴巴高级工程师，区块链技术专家，拥有多个DApp项目开发经验'
    },
    {
      name: '王强',
      role: '运营总监 & COO',
      avatar: '👨‍🏫',
      description: '10年电商运营经验，擅长农产品品牌营销和用户增长策略'
    },
    {
      name: '刘芳',
      role: '产品总监',
      avatar: '👩‍🎨',
      description: '资深产品经理，曾主导多个千万级用户产品设计，注重用户体验'
    }
  ];

  const milestones = [
    { year: '2024年1月', title: '平台立项', description: '完成项目立项和团队组建' },
    { year: '2024年3月', title: '技术开发', description: '完成核心技术架构搭建' },
    { year: '2024年6月', title: '智能合约部署', description: '完成BSC主网智能合约部署' },
    { year: '2024年9月', title: 'Beta测试', description: '开启内测，首批用户体验' },
    { year: '2025年1月', title: '正式上线', description: '平台正式对外开放' },
    { year: '2025年4月', title: '首个预售', description: '恐龙蛋荔枝预售活动启动' }
  ];

  const stats = [
    { number: '10,000+', label: '注册用户', icon: '👥' },
    { number: '3', label: '合作果园', icon: '🌳' },
    { number: '6', label: '预售活动', icon: '🎯' },
    { number: '¥100万+', label: '累计交易额', icon: '💰' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white py-24 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-300 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center fade-in">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              关于我们
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8">
              用区块链技术革新农业，连接生产者与消费者
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>真实溯源</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>安全可靠</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>品质保证</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 数据统计 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-5xl mb-3">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 公司介绍 */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                钜园农业NFT预售平台
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                钜园农业成立于2024年，是一家专注于区块链技术在农业领域应用的创新型企业。
                我们致力于通过NFT技术实现农产品的数字化、透明化和价值化，
                为生产者提供资金支持，为消费者提供优质产品，共建可信的农业生态。
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* 使命 */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow card-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">我们的使命</h3>
                <p className="text-gray-600 leading-relaxed">
                  通过区块链技术赋能农业，让每一份优质农产品都能找到它的价值，
                  让每一位生产者都能获得应有的回报，让每一位消费者都能享受到安心的产品。
                </p>
              </div>

              {/* 愿景 */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow card-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">我们的愿景</h3>
                <p className="text-gray-600 leading-relaxed">
                  成为中国领先的农产品区块链预售平台，
                  建立覆盖全国的优质农产品供应网络，
                  让区块链技术真正服务于农业现代化。
                </p>
              </div>
            </div>
          </div>
        </div>
            </section>

      {/* 核心优势 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 fade-in">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">核心优势</h2>
              <p className="text-xl text-gray-600">为什么选择钜园农业NFT预售平台</p>
                  </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🔒',
                  title: '区块链溯源',
                  description: '全流程上链记录，从种植、采摘到配送，每个环节都透明可查，确保产品真实性',
                  color: 'from-green-500 to-emerald-600'
                },
                {
                  icon: '💎',
                  title: 'NFT权益凭证',
                  description: '购买即获得独特的NFT凭证，不仅是产品所有权证明，更具有收藏和增值价值',
                  color: 'from-purple-500 to-pink-600'
                },
                {
                  icon: '🛡️',
                  title: '智能合约保障',
                  description: '资金由智能合约托管，分阶段释放，确保买卖双方权益，降低交易风险',
                  color: 'from-blue-500 to-cyan-600'
                },
                {
                  icon: '🌱',
                  title: '优质产地直供',
                  description: '精选认证果园，有机种植，无中间商赚差价，产地直发保证新鲜',
                  color: 'from-green-500 to-teal-600'
                },
                {
                  icon: '⚡',
                  title: '预售价格优惠',
                  description: '提前预订享受超低预售价，最高可享7折优惠，支持农民获得提前收益',
                  color: 'from-orange-500 to-red-600'
                },
                {
                  icon: '📱',
                  title: '便捷操作体验',
                  description: '简洁直观的界面设计，一键下单，实时查询订单状态和物流信息',
                  color: 'from-indigo-500 to-purple-600'
                }
              ].map((item, index) => (
                <div key={index} className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2 fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 text-4xl group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 团队介绍 */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 fade-in">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">核心团队</h2>
              <p className="text-xl text-gray-600">经验丰富的专业团队</p>
                  </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all transform hover:-translate-y-2 fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center text-5xl">
                    {member.avatar}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-sm text-green-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 发展里程碑 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 fade-in">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">发展历程</h2>
              <p className="text-xl text-gray-600">我们的成长足迹</p>
            </div>

            <div className="relative">
              {/* 时间线 */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-500 to-emerald-600 hidden md:block"></div>

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} fade-in`} style={{ animationDelay: `${index * 100}ms` }}>
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="text-sm font-semibold text-green-600 mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg flex-shrink-0 hidden md:block"></div>
                    <div className="flex-1 hidden md:block"></div>
                  </div>
                ))}
              </div>
                  </div>
                </div>
              </div>
            </section>

      {/* 技术架构 */}
      <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 fade-in">
              <h2 className="text-4xl font-bold mb-4">技术架构</h2>
              <p className="text-xl text-gray-300">采用前沿技术栈，确保平台稳定高效</p>
                </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: '前端技术', techs: ['Next.js 14', 'React 18', 'TypeScript', 'TailwindCSS'], icon: '💻' },
                { title: '后端技术', techs: ['Node.js', 'Express', 'PostgreSQL', 'Redis'], icon: '⚙️' },
                { title: '区块链', techs: ['BSC Network', 'Hardhat', 'OpenZeppelin', 'Web3.js'], icon: '⛓️' },
                { title: '基础设施', techs: ['Docker', 'Nginx', 'Prisma ORM', 'JWT Auth'], icon: '🏗️' }
              ].map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <ul className="space-y-2">
                    {item.techs.map((tech, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
                </div>
                </div>
              </div>
            </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              开启您的农产品NFT之旅
            </h2>
            <p className="text-xl text-green-100 mb-10">
              加入钜园农业，体验区块链技术带来的全新农产品购买体验
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/presales"
                className="px-10 py-4 bg-white text-green-600 rounded-xl font-bold text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg"
              >
                浏览预售
              </Link>
              <a
                href="mailto:contact@juyuan-agriculture.com"
                className="px-10 py-4 bg-transparent text-white rounded-xl font-bold text-lg border-2 border-white hover:bg-white/10 transition-all transform hover:scale-105"
              >
                联系我们
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-12 bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-6">联系方式</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl mb-2">📧</div>
                <p className="font-semibold text-white mb-1">邮箱</p>
                <p className="text-sm">contact@juyuan-agriculture.com</p>
              </div>
              <div>
                <div className="text-3xl mb-2">📱</div>
                <p className="font-semibold text-white mb-1">客服电话</p>
                <p className="text-sm">400-888-8888</p>
              </div>
              <div>
                <div className="text-3xl mb-2">📍</div>
                <p className="font-semibold text-white mb-1">公司地址</p>
                <p className="text-sm">广东省广州市天河区</p>
              </div>
          </div>
        </div>
      </div>
      </section>
    </div>
  );
}

