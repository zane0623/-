'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: '张明',
    role: '资深投资者',
    avatar: '👨‍💼',
    rating: 5,
    content: '钜园农业NFT平台让我第一次体验到区块链溯源的魅力，每一份农产品都有完整的生产记录，吃得放心！'
  },
  {
    name: '李婷',
    role: '美食博主',
    avatar: '👩‍🍳',
    rating: 5,
    content: '作为一个对食材品质要求很高的人，这个平台完美满足了我的需求。葡萄新鲜度超乎想象，推荐给所有美食爱好者！'
  },
  {
    name: '王强',
    role: '企业采购',
    avatar: '👨‍💻',
    rating: 5,
    content: '公司福利采购一直在用钜园农业，NFT确权让采购流程更透明，员工反馈都非常好，品质有保障！'
  }
];

export function Testimonials() {
  return (
    <section className="relative py-32 bg-slate-950 overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-dots-pattern opacity-20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10">
        {/* 标题 */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
            用户评价
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            用户<span className="text-gradient">真实</span>反馈
          </h2>
          <p className="text-xl text-slate-400">
            听听他们怎么说
          </p>
        </div>

        {/* 评价卡片 */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="group relative p-8 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-3xl hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* 引号装饰 */}
              <div className="absolute top-6 right-6 w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <Quote className="w-6 h-6 text-emerald-500/50" />
              </div>
              
              {/* 评分 */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                ))}
              </div>
              
              {/* 内容 */}
              <p className="text-slate-300 leading-relaxed mb-8 text-lg">
                "{testimonial.content}"
              </p>
              
              {/* 用户信息 */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center text-3xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
