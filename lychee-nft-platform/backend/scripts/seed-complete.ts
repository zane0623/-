/**
 * 完整数据库种子脚本 - 创建完整的测试数据
 */

import { PrismaClient, PresaleStatus, AuditStatus, OrchardStatus, UserRole, UserStatus, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始填充完整测试数据...');
  console.log('');

  // ============================================
  // 1. 创建果园
  // ============================================
  console.log('📍 创建果园...');
  
  const orchards = [
    {
      id: 'orchard-juyuan-lychee',
      name: '钜园农业恐龙蛋荔枝园',
      name_en: 'Juyuan Dragon Egg Lychee Orchard',
      description: '位于广东省茂名市的优质荔枝种植基地，拥有超过100亩的恐龙蛋荔枝种植园。我们采用有机种植方式，严格控制品质，确保每一颗荔枝都达到最高标准。园区通过国家有机认证和GAP认证。',
      description_en: 'Premium lychee plantation base located in Maoming, Guangdong Province.',
      location: {
        country: '中国',
        province: '广东省',
        city: '茂名市',
        district: '高州市',
        coordinates: { lat: 21.9174, lng: 110.8467 }
      },
      area: 100,
      logo_url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=200',
      cover_image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
      images: [
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'
      ],
      certifications: [
        { type: 'organic', name: '有机产品认证', issued_by: '中国有机产品认证中心', date: '2024-01-15', number: 'ORG-2024-001' },
        { type: 'quality', name: '良好农业规范认证(GAP)', issued_by: '中国质量认证中心', date: '2024-02-20', number: 'GAP-2024-001' },
        { type: 'quality', name: '地理标志产品', issued_by: '国家知识产权局', date: '2023-12-01', number: 'GI-2023-001' }
      ],
      rating: 4.8,
      total_sales: 523,
      status: OrchardStatus.ACTIVE,
      verified: true
    },
    {
      id: 'orchard-sunshine-farm',
      name: '阳光生态农场',
      name_en: 'Sunshine Eco Farm',
      description: '专注于有机蔬菜和水果种植的现代化农场，位于广州市郊，占地50亩。采用滴灌技术和生物防治，生产绿色健康的农产品。',
      description_en: 'Modern farm specializing in organic vegetables and fruits.',
      location: {
        country: '中国',
        province: '广东省',
        city: '广州市',
        district: '增城区',
        coordinates: { lat: 23.2569, lng: 113.6308 }
      },
      area: 50,
      images: [],
      certifications: [
        { type: 'organic', name: '有机认证', issued_by: '中国有机产品认证', date: '2024-03-01' }
      ],
      rating: 4.5,
      total_sales: 234,
      status: OrchardStatus.ACTIVE,
      verified: true
    },
    {
      id: 'orchard-green-valley',
      name: '翠谷果园',
      name_en: 'Green Valley Orchard',
      description: '专业种植各类优质水果，包括荔枝、龙眼、芒果等。位于惠州市，拥有200亩种植面积，是华南地区重要的水果供应基地。',
      description_en: 'Professional cultivation of various premium fruits.',
      location: {
        country: '中国',
        province: '广东省',
        city: '惠州市',
        district: '惠阳区',
        coordinates: { lat: 22.7886, lng: 114.4565 }
      },
      area: 200,
      images: [],
      certifications: [
        { type: 'quality', name: 'GAP认证', issued_by: '农业部', date: '2024-01-10' }
      ],
      rating: 4.6,
      total_sales: 389,
      status: OrchardStatus.ACTIVE,
      verified: true
    }
  ];

  for (const orchardData of orchards) {
    const orchard = await prisma.orchard.upsert({
      where: { id: orchardData.id },
      update: orchardData,
      create: orchardData
    });
    console.log(`  ✅ ${orchard.name}`);
  }

  console.log('');

  // ============================================
  // 2. 创建预售活动
  // ============================================
  console.log('🎯 创建预售活动...');

  const presales = [
    {
      id: 'presale-dragon-egg-2025',
      presale_number: 'PS2025001',
      orchard_id: 'orchard-juyuan-lychee',
      title: '2025年钜园恐龙蛋荔枝预售',
      title_en: '2025 Dragon Egg Lychee Presale',
      subtitle: '限量1000份 · 新鲜直达',
      subtitle_en: 'Limited 1000 units · Fresh Delivery',
      description: '恐龙蛋荔枝是荔枝中的极品，果大核小，肉厚汁多，清甜爽口。我们的恐龙蛋荔枝采用传统种植方式，不使用化学农药，保证纯天然无污染。每份5斤装，预计6月下旬成熟采摘并配送。产地直供，确保新鲜度。',
      description_en: 'Dragon Egg Lychee is the premium variety among lychees.',
      cover_image: 'https://images.unsplash.com/photo-1591206369811-4eeb2f18ecf4?w=800',
      banner_images: [
        'https://images.unsplash.com/photo-1591206369811-4eeb2f18ecf4?w=1200',
        'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=1200'
      ],
      video_url: null,
      product_info: {
        category: '水果',
        variety: '恐龙蛋荔枝',
        specification: '5斤/份',
        origin: '广东茂名高州',
        quality_grade: 'A+',
        features: ['果大核小', '肉厚多汁', '清甜爽口', '有机种植', '产地直供', '新鲜采摘']
      },
      pricing: {
        presale_price: 188,
        market_price: 268,
        currency: 'CNY',
        discount_rate: 30
      },
      inventory: {
        total: 1000,
        sold: 234,
        available: 766,
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
          benefits: ['溯源查询', '收藏价值', '优先购买权', 'VIP特权']
        }
      },
      shipping: {
        methods: ['顺丰快递', 'EMS'],
        fees: { standard: 0, express: 20 },
        estimated_days: { standard: 3, express: 1 },
        supported_regions: ['全国（除港澳台）']
      },
      status: PresaleStatus.ACTIVE,
      audit_status: AuditStatus.APPROVED,
      tags: ['荔枝', '恐龙蛋', '有机', '新鲜水果', '产地直发', '限量版'],
      stats: {
        views: 5234,
        likes: 456,
        shares: 89,
        conversion_rate: 0.18
      },
      published_at: new Date('2025-04-01')
    },
    {
      id: 'presale-organic-guiwei-2025',
      presale_number: 'PS2025002',
      orchard_id: 'orchard-juyuan-lychee',
      title: '有机桂味荔枝预售',
      title_en: 'Organic Guiwei Lychee Presale',
      subtitle: '经典桂味 · 香甜可口',
      subtitle_en: 'Classic Guiwei · Sweet and Fragrant',
      description: '桂味荔枝以其独特的桂花香味而闻名，果肉晶莹剔透，口感细腻。我们的桂味荔枝园通过有机认证，采用生态种植方式，让您品尝到最纯正的荔枝风味。每份3斤装，适合家庭品尝。',
      description_en: 'Guiwei Lychee is renowned for its unique osmanthus fragrance.',
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
        sold: 156,
        available: 644,
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
      status: PresaleStatus.ACTIVE,
      audit_status: AuditStatus.APPROVED,
      tags: ['荔枝', '桂味', '有机', '香甜'],
      stats: {
        views: 2567,
        likes: 234,
        shares: 45,
        conversion_rate: 0.15
      },
      published_at: new Date('2025-04-15')
    },
    {
      id: 'presale-premium-nuomici-2025',
      presale_number: 'PS2025003',
      orchard_id: 'orchard-juyuan-lychee',
      title: '糯米糍荔枝礼盒装预售',
      title_en: 'Premium Nuomici Lychee Gift Box',
      subtitle: '高端礼盒 · 送礼首选',
      subtitle_en: 'Premium Gift Box · Perfect for Gifting',
      description: '糯米糍荔枝口感软糯，核小肉厚，甜度极高。我们精选特级糯米糍，配以精美礼盒包装，是您送礼的最佳选择。每盒8斤装，分4盒精装，适合商务送礼或家庭分享。配送顺丰次日达，确保品质。',
      description_en: 'Nuomici Lychee has a soft and glutinous texture.',
      cover_image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800',
      banner_images: [],
      product_info: {
        category: '水果礼盒',
        variety: '糯米糍荔枝',
        specification: '8斤/盒（4盒×2斤）',
        origin: '广东茂名',
        quality_grade: 'S',
        features: ['软糯香甜', '核小肉厚', '精美包装', '送礼首选', '次日达']
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
      status: PresaleStatus.SCHEDULED,
      audit_status: AuditStatus.APPROVED,
      tags: ['荔枝', '糯米糍', '礼盒', '高端', '送礼'],
      stats: {
        views: 1234,
        likes: 89,
        shares: 23,
        conversion_rate: 0
      }
    },
    {
      id: 'presale-organic-veggie-box',
      presale_number: 'PS2025004',
      orchard_id: 'orchard-sunshine-farm',
      title: '有机蔬菜周配套餐',
      title_en: 'Weekly Organic Vegetable Box',
      subtitle: '新鲜采摘 · 每周配送',
      subtitle_en: 'Freshly Picked · Weekly Delivery',
      description: '精选当季有机蔬菜，每周新鲜采摘配送。套餐包含5-7种时令蔬菜，约5kg，满足三口之家一周所需。采用生态种植，无农药残留，健康营养。',
      description_en: 'Selected seasonal organic vegetables, freshly picked weekly.',
      cover_image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
      banner_images: [],
      product_info: {
        category: '有机蔬菜',
        variety: '混合蔬菜套餐',
        specification: '约5kg/周',
        origin: '广州增城',
        quality_grade: 'A',
        features: ['有机认证', '当季新鲜', '每周配送', '营养丰富']
      },
      pricing: {
        presale_price: 98,
        market_price: 138,
        currency: 'CNY',
        discount_rate: 29
      },
      inventory: {
        total: 200,
        sold: 78,
        available: 122,
        min_purchase: 4,
        max_purchase: 52,
        limit_per_user: 52
      },
      timeline: {
        presale_start: new Date('2025-04-01'),
        presale_end: new Date('2025-12-31'),
        harvest_start: new Date('2025-04-10'),
        harvest_end: new Date('2025-12-31'),
        delivery_start: new Date('2025-04-12'),
        delivery_end: new Date('2025-12-31')
      },
      nft_config: {
        enabled: true,
        contract_address: '',
        token_uri_base: 'ipfs://',
        metadata: {
          collection: '阳光农场NFT',
          benefits: ['每周配送', '会员折扣']
        }
      },
      shipping: {
        methods: ['自营配送'],
        fees: { standard: 0 },
        estimated_days: { standard: 1 },
        supported_regions: ['广州市区']
      },
      status: PresaleStatus.ACTIVE,
      audit_status: AuditStatus.APPROVED,
      tags: ['有机蔬菜', '周配', '健康', '新鲜'],
      stats: {
        views: 3456,
        likes: 278,
        shares: 56,
        conversion_rate: 0.22
      },
      published_at: new Date('2025-04-01')
    },
    {
      id: 'presale-mango-season',
      presale_number: 'PS2025005',
      orchard_id: 'orchard-green-valley',
      title: '贵妃芒果预售',
      title_en: 'Guifei Mango Presale',
      subtitle: '香甜多汁 · 果中贵妃',
      subtitle_en: 'Sweet and Juicy',
      description: '贵妃芒果以其独特的香味和细腻的口感而闻名。我们的芒果园位于惠州，气候条件优越，产出的贵妃芒果色泽金黄，香甜可口。每份装有精选5-6个芒果，约5斤重。',
      description_en: 'Guifei Mango is known for its unique aroma and delicate taste.',
      cover_image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800',
      banner_images: [],
      product_info: {
        category: '水果',
        variety: '贵妃芒果',
        specification: '5-6个/份（约5斤）',
        origin: '广东惠州',
        quality_grade: 'A+',
        features: ['香甜多汁', '果肉细腻', '色泽金黄', '营养丰富']
      },
      pricing: {
        presale_price: 158,
        market_price: 228,
        currency: 'CNY',
        discount_rate: 31
      },
      inventory: {
        total: 600,
        sold: 0,
        available: 600,
        min_purchase: 1,
        max_purchase: 10,
        limit_per_user: 5
      },
      timeline: {
        presale_start: new Date('2025-05-15'),
        presale_end: new Date('2025-06-30'),
        harvest_start: new Date('2025-07-15'),
        harvest_end: new Date('2025-08-15'),
        delivery_start: new Date('2025-07-18'),
        delivery_end: new Date('2025-08-18')
      },
      nft_config: {
        enabled: true,
        contract_address: '',
        token_uri_base: 'ipfs://',
        metadata: {
          collection: '翠谷果园NFT',
          benefits: ['溯源查询', '优惠券']
        }
      },
      shipping: {
        methods: ['顺丰快递'],
        fees: { standard: 0 },
        estimated_days: { standard: 2 },
        supported_regions: ['全国']
      },
      status: PresaleStatus.SCHEDULED,
      audit_status: AuditStatus.APPROVED,
      tags: ['芒果', '贵妃芒', '香甜', '新鲜水果'],
      stats: {
        views: 890,
        likes: 67,
        shares: 12,
        conversion_rate: 0
      }
    },
    {
      id: 'presale-longan-premium',
      presale_number: 'PS2025006',
      orchard_id: 'orchard-green-valley',
      title: '储良龙眼预售',
      title_en: 'Premium Longan Presale',
      subtitle: '肉厚核小 · 清甜爽口',
      subtitle_en: 'Thick Flesh · Sweet Taste',
      description: '储良龙眼是龙眼中的上品，以肉厚核小、清甜爽口而著称。我们的龙眼园位于惠州，采用传统种植方法，自然成熟，确保最佳口感。每份3斤装，现摘现发。',
      description_en: 'Chuliang Longan is a premium variety known for its thick flesh.',
      cover_image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800',
      banner_images: [],
      product_info: {
        category: '水果',
        variety: '储良龙眼',
        specification: '3斤/份',
        origin: '广东惠州',
        quality_grade: 'A',
        features: ['肉厚核小', '清甜爽口', '营养丰富', '现摘现发']
      },
      pricing: {
        presale_price: 88,
        market_price: 128,
        currency: 'CNY',
        discount_rate: 31
      },
      inventory: {
        total: 400,
        sold: 0,
        available: 400,
        min_purchase: 1,
        max_purchase: 10,
        limit_per_user: 5
      },
      timeline: {
        presale_start: new Date('2025-06-01'),
        presale_end: new Date('2025-07-15'),
        harvest_start: new Date('2025-08-01'),
        harvest_end: new Date('2025-08-31'),
        delivery_start: new Date('2025-08-05'),
        delivery_end: new Date('2025-09-05')
      },
      nft_config: {
        enabled: false,
        contract_address: '',
        token_uri_base: '',
        metadata: {}
      },
      shipping: {
        methods: ['顺丰快递', 'EMS'],
        fees: { standard: 0, express: 15 },
        estimated_days: { standard: 3, express: 1 },
        supported_regions: ['全国']
      },
      status: PresaleStatus.DRAFT,
      audit_status: AuditStatus.PENDING,
      tags: ['龙眼', '储良', '清甜', '新鲜'],
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
    console.log(`  ✅ ${presale.title} (${presale.status})`);
  }

  console.log('');

  // ============================================
  // 3. 创建示例用户
  // ============================================
  console.log('👤 创建示例用户...');

  const users = [
    {
      id: 'user-demo-1',
      email: 'demo@example.com',
      username: 'demo_user',
      full_name: '张三',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      email_verified: true,
      wallet_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4',
      preferred_language: 'zh-CN',
      preferred_currency: 'CNY'
    },
    {
      id: 'user-demo-2',
      email: 'vip@example.com',
      username: 'vip_user',
      full_name: '李四',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      email_verified: true,
      wallet_address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      preferred_language: 'zh-CN',
      preferred_currency: 'CNY',
      total_orders: 15,
      total_spent: 2340.50,
      loyalty_points: 234
    }
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { id: userData.id },
      update: userData,
      create: userData
    });
    console.log(`  ✅ ${user.full_name} (${user.email})`);
  }

  console.log('');

  console.log('🎉 完整测试数据填充成功！');
  console.log('');
  console.log('📊 数据统计:');
  console.log(`   - 果园: ${orchards.length}个`);
  console.log(`   - 预售活动: ${presales.length}个`);
  console.log(`   - 示例用户: ${users.length}个`);
  console.log('');
  console.log('🌐 访问地址:');
  console.log('   前端: http://localhost:3000');
  console.log('   预售列表: http://localhost:3000/presales');
  console.log('   数据库管理: http://localhost:5555');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

