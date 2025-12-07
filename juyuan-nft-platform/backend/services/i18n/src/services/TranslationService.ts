import Redis from 'ioredis';

// 翻译数据
const translations: Record<string, Record<string, any>> = {
  'zh-CN': {
    common: {
      home: '首页',
      presale: '预售市场',
      myNfts: '我的NFT',
      traceability: '溯源查询',
      help: '帮助中心',
      login: '登录',
      register: '注册',
      logout: '退出登录',
      connectWallet: '连接钱包',
      search: '搜索',
      loading: '加载中...',
      submit: '提交',
      cancel: '取消',
      confirm: '确认',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      view: '查看',
      back: '返回'
    },
    presale: {
      title: '预售市场',
      buyNow: '立即购买',
      soldOut: '已售罄',
      upcoming: '即将开售',
      active: '预售中',
      ended: '已结束',
      price: '价格',
      remaining: '剩余',
      progress: '销售进度',
      harvestDate: '采收日期',
      originBase: '产地基地'
    },
    nft: {
      title: '我的NFT',
      tokenId: 'Token ID',
      productType: '产品类型',
      quantity: '数量',
      qualityGrade: '品质等级',
      delivered: '已交付',
      pending: '待交付',
      transfer: '转移',
      details: '详情'
    },
    trace: {
      title: '溯源查询',
      timeline: '溯源时间线',
      certificate: '溯源证书',
      qrcode: '溯源二维码',
      verified: '已验证',
      planting: '种植',
      growing: '生长',
      harvesting: '采收',
      processing: '加工',
      packaging: '包装',
      shipping: '运输',
      delivered: '交付'
    },
    payment: {
      title: '支付',
      amount: '金额',
      method: '支付方式',
      success: '支付成功',
      failed: '支付失败',
      pending: '支付中'
    },
    error: {
      notFound: '页面不存在',
      serverError: '服务器错误',
      unauthorized: '请先登录',
      forbidden: '无权访问'
    }
  },
  'en-US': {
    common: {
      home: 'Home',
      presale: 'Presale',
      myNfts: 'My NFTs',
      traceability: 'Traceability',
      help: 'Help',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      connectWallet: 'Connect Wallet',
      search: 'Search',
      loading: 'Loading...',
      submit: 'Submit',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      back: 'Back'
    },
    presale: {
      title: 'Presale Market',
      buyNow: 'Buy Now',
      soldOut: 'Sold Out',
      upcoming: 'Coming Soon',
      active: 'Active',
      ended: 'Ended',
      price: 'Price',
      remaining: 'Remaining',
      progress: 'Progress',
      harvestDate: 'Harvest Date',
      originBase: 'Origin'
    },
    nft: {
      title: 'My NFTs',
      tokenId: 'Token ID',
      productType: 'Product Type',
      quantity: 'Quantity',
      qualityGrade: 'Quality Grade',
      delivered: 'Delivered',
      pending: 'Pending',
      transfer: 'Transfer',
      details: 'Details'
    },
    trace: {
      title: 'Traceability',
      timeline: 'Timeline',
      certificate: 'Certificate',
      qrcode: 'QR Code',
      verified: 'Verified',
      planting: 'Planting',
      growing: 'Growing',
      harvesting: 'Harvesting',
      processing: 'Processing',
      packaging: 'Packaging',
      shipping: 'Shipping',
      delivered: 'Delivered'
    },
    payment: {
      title: 'Payment',
      amount: 'Amount',
      method: 'Payment Method',
      success: 'Payment Successful',
      failed: 'Payment Failed',
      pending: 'Processing'
    },
    error: {
      notFound: 'Page Not Found',
      serverError: 'Server Error',
      unauthorized: 'Please Login',
      forbidden: 'Access Denied'
    }
  },
  'zh-TW': {
    common: {
      home: '首頁',
      presale: '預售市場',
      myNfts: '我的NFT',
      traceability: '溯源查詢',
      help: '幫助中心',
      login: '登入',
      register: '註冊',
      logout: '登出',
      connectWallet: '連接錢包'
    }
  }
};

export class TranslationService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379')
    });
  }

  /**
   * 获取翻译
   */
  async getTranslations(locale: string, namespace?: string) {
    const localeTranslations = translations[locale] || translations['en-US'];

    if (namespace) {
      return localeTranslations[namespace] || {};
    }

    return localeTranslations;
  }

  /**
   * 翻译单个key
   */
  async translate(key: string, locale: string, params: Record<string, string> = {}) {
    const keys = key.split('.');
    let result = translations[locale] || translations['en-US'];

    for (const k of keys) {
      result = result?.[k];
      if (!result) break;
    }

    if (typeof result !== 'string') {
      return key; // 返回key作为fallback
    }

    // 替换参数
    for (const [param, value] of Object.entries(params)) {
      result = result.replace(new RegExp(`{{${param}}}`, 'g'), value);
    }

    return result;
  }

  /**
   * 检测语言
   */
  detectLocale(acceptLanguage: string): string {
    const supported = ['zh-CN', 'zh-TW', 'en-US', 'th-TH', 'ms-MY', 'vi-VN', 'ja-JP', 'ko-KR'];
    
    const languages = acceptLanguage.split(',').map(lang => {
      const [code] = lang.trim().split(';');
      return code;
    });

    for (const lang of languages) {
      if (supported.includes(lang)) {
        return lang;
      }
      // 检查语言前缀
      const prefix = lang.split('-')[0];
      const match = supported.find(s => s.startsWith(prefix));
      if (match) return match;
    }

    return 'en-US';
  }
}

