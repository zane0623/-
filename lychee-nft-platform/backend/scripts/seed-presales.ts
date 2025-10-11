/**
 * 数据库种子脚本 - 添加测试预售数据
 */

import { PrismaClient, PresaleStatus, AuditStatus, OrchardStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始填充测试数据...');

  // 创建测试果园
  const orchard = await prisma.orchard.upsert({
    where: { id: 'test-orchard-1' },
    update: {},
    create: {
      id: 'test-orchard-1',
      name: '钜园农业恐龙蛋荔枝园',
      name_en: 'Juyuan Dragon Egg Lychee Orchard',
      description: '位于广东省茂名市的优质荔枝种植基地，拥有超过100亩的恐龙蛋荔枝种植园。我们采用有机种植方式，严格控制品质，确保每一颗荔枝都达到最高标准。',
      description_en: 'Premium lychee plantation base located in Maoming, Guangdong Province, with over 100 acres of dragon egg lychee orchards.',
      location: {
        country: '中国',
        province: '广东省',
        city: '茂名市',
        coordinates: { lat: 21.6618, lng: 110.9255 }
      },
      area: 100,
      images: [],
      certifications: [
        { type: 'organic', name: '有机认证', issued_by: '中国有机产品认证', date: '2024-01-01' },
        { type: 'quality', name: 'GAP认证', issued_by: '农业部', date: '2024-01-01' }
      ],
      rating: 4.8,
      status: OrchardStatus.ACTIVE,
      verified: true
    }
  });

  console.log('✅ 果园创建成功:', orchard.name);

  // 创建预售活动
  const presales = [
    {
      id: 'presale-dragon-egg-2025',
      presale_number: 'PS2025001',
      orchard_id: orchard.id,
      title: '2025年钜园恐龙蛋荔枝预售',
      title_en: '2025 Dragon Egg Lychee Presale',
      subtitle: '限量1000份 · 新鲜直达',
      subtitle_en: 'Limited 1000 units · Fresh Delivery',
      description: '恐龙蛋荔枝是荔枝中的极品，果大核小，肉厚汁多，清甜爽口。我们的恐龙蛋荔枝采用传统种植方式，不使用化学农药，保证纯天然无污染。每份5斤装，预计6月下旬成熟采摘并配送。',
      description_en: 'Dragon Egg Lychee is the premium variety among lychees, featuring large fruit with small seeds, thick flesh, and abundant juice.',
      cover_image: 'https://images.unsplash.com/photo-1591206369811-4eeb2f18ecf4?w=800',
      banner_images: [],
      product_info: {
        category: '水果',
        variety: '恐龙蛋荔枝',
        specification: '5斤/份',
        origin: '广东茂名',
        quality_grade: 'A+',
        features: ['果大核小', '肉厚多汁', '清甜爽口', '有机种植']
      },
      pricing: {
        presale_price: 188,
        market_price: 268,
        currency: 'CNY',
        discount_rate: 30
      },
      inventory: {
        total: 1000,
        sold: 0,
        available: 1000,
        min_purchase: 1,
        max_purchase: 10,
        limit_per_user: 5
      },
      timeline: {
        presale_start: new Date('2025-04-01'),
        presale_end: new Date('2025-05-31'),
        harvest_start: new Date('2025-06-20'),
        harvest_end: new Date('2025-07-10'),
        delivery_start: new Date('2025-06-25'),
        delivery_end: new Date('2025-07-15')
      },
      nft_config: {
        enabled: true,
        contract_address: '',
        token_uri_base: 'ipfs://',
        metadata: {
          collection: '钜园农业NFT',
          benefits: ['溯源查询', '收藏价值', '优先购买权']
        }
      },
      shipping: {
        methods: ['顺丰快递', 'EMS'],
        fees: { standard: 0, express: 20 },
        estimated_days: { standard: 3, express: 1 },
        supported_regions: ['全国']
      },
      status: PresaleStatus.ACTIVE,
      audit_status: AuditStatus.APPROVED,
      tags: ['荔枝', '恐龙蛋', '有机', '新鲜水果', '产地直发'],
      stats: {
        views: 1234,
        likes: 89,
        shares: 23,
        conversion_rate: 0.15
      },
      published_at: new Date()
    },
    {
      id: 'presale-organic-lychee-2025',
      presale_number: 'PS2025002',
      orchard_id: orchard.id,
      title: '有机桂味荔枝预售',
      title_en: 'Organic Guiwei Lychee Presale',
      subtitle: '经典桂味 · 香甜可口',
      subtitle_en: 'Classic Guiwei · Sweet and Fragrant',
      description: '桂味荔枝以其独特的桂花香味而闻名，果肉晶莹剔透，口感细腻。我们的桂味荔枝园通过有机认证，采用生态种植方式，让您品尝到最纯正的荔枝风味。',
      description_en: 'Guiwei Lychee is renowned for its unique osmanthus fragrance, crystal clear flesh, and delicate taste.',
      cover_image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800',
      banner_images: [],
      product_info: {
        category: '水果',
        variety: '桂味荔枝',
        specification: '3斤/份',
        origin: '广东茂名',
        quality_grade: 'A',
        features: ['桂花香味', '肉质细腻', '甜度适中', '有机认证']
      },
      pricing: {
        presale_price: 128,
        market_price: 178,
        currency: 'CNY',
        discount_rate: 28
      },
      inventory: {
        total: 800,
        sold: 0,
        available: 800,
        min_purchase: 1,
        max_purchase: 10,
        limit_per_user: 5
      },
      timeline: {
        presale_start: new Date('2025-04-15'),
        presale_end: new Date('2025-06-15'),
        harvest_start: new Date('2025-07-01'),
        harvest_end: new Date('2025-07-20'),
        delivery_start: new Date('2025-07-05'),
        delivery_end: new Date('2025-07-25')
      },
      nft_config: {
        enabled: true,
        contract_address: '',
        token_uri_base: 'ipfs://',
        metadata: {
          collection: '钜园农业NFT',
          benefits: ['溯源查询', '会员优惠']
        }
      },
      shipping: {
        methods: ['顺丰快递'],
        fees: { standard: 0 },
        estimated_days: { standard: 3 },
        supported_regions: ['全国']
      },
      status: PresaleStatus.SCHEDULED,
      audit_status: AuditStatus.APPROVED,
      tags: ['荔枝', '桂味', '有机', '香甜'],
      stats: {
        views: 567,
        likes: 45,
        shares: 12,
        conversion_rate: 0.12
      }
    },
    {
      id: 'presale-premium-lychee-2025',
      presale_number: 'PS2025003',
      orchard_id: orchard.id,
      title: '糯米糍荔枝礼盒装预售',
      title_en: 'Premium Nuomici Lychee Gift Box',
      subtitle: '高端礼盒 · 送礼首选',
      subtitle_en: 'Premium Gift Box · Perfect for Gifting',
      description: '糯米糍荔枝口感软糯，核小肉厚，甜度极高。我们精选特级糯米糍，配以精美礼盒包装，是您送礼的最佳选择。每盒8斤装，分4盒精装，适合商务送礼或家庭分享。',
      description_en: 'Nuomici Lychee has a soft and glutinous texture, small seed, thick flesh, and extremely high sweetness.',
      cover_image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800',
      banner_images: [],
      product_info: {
        category: '水果礼盒',
        variety: '糯米糍荔枝',
        specification: '8斤/盒（4盒×2斤）',
        origin: '广东茂名',
        quality_grade: 'S',
        features: ['软糯香甜', '核小肉厚', '精美包装', '送礼首选']
      },
      pricing: {
        presale_price: 388,
        market_price: 568,
        currency: 'CNY',
        discount_rate: 32
      },
      inventory: {
        total: 500,
        sold: 0,
        available: 500,
        min_purchase: 1,
        max_purchase: 5,
        limit_per_user: 3
      },
      timeline: {
        presale_start: new Date('2025-05-01'),
        presale_end: new Date('2025-06-20'),
        harvest_start: new Date('2025-06-25'),
        harvest_end: new Date('2025-07-05'),
        delivery_start: new Date('2025-06-28'),
        delivery_end: new Date('2025-07-08')
      },
      nft_config: {
        enabled: true,
        contract_address: '',
        token_uri_base: 'ipfs://',
        metadata: {
          collection: '钜园农业高端NFT',
          benefits: ['溯源查询', '收藏价值', 'VIP特权', '限量版证书']
        }
      },
      shipping: {
        methods: ['顺丰次日达'],
        fees: { express: 0 },
        estimated_days: { express: 1 },
        supported_regions: ['全国']
      },
      status: PresaleStatus.DRAFT,
      audit_status: AuditStatus.PENDING,
      tags: ['荔枝', '糯米糍', '礼盒', '高端', '送礼'],
      stats: {
        views: 0,
        likes: 0,
        shares: 0,
        conversion_rate: 0
      }
    }
  ];

  for (const presaleData of presales) {
    const presale = await prisma.presale.upsert({
      where: { id: presaleData.id },
      update: presaleData,
      create: presaleData
    });
    console.log('✅ 预售创建成功:', presale.title);
  }

  console.log('');
  console.log('🎉 测试数据填充完成！');
  console.log('');
  console.log('📊 数据统计:');
  console.log(`   - 果园: 1个`);
  console.log(`   - 预售活动: ${presales.length}个`);
  console.log('');
  console.log('🌐 立即访问前端查看效果: http://localhost:3000/presales');
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

