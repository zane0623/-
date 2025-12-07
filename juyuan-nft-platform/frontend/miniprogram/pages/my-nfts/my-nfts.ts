// 我的NFT页
const app = getApp<IAppOption>();

Page({
  data: {
    isLoggedIn: false,
    nfts: [] as any[],
    stats: { total: 0, pending: 0, delivered: 0 },
    currentFilter: 'all',
    loading: false
  },

  onLoad() {
    this.checkLoginStatus();
  },

  onShow() {
    if (app.globalData.token) {
      this.loadNFTs();
    }
  },

  checkLoginStatus() {
    const token = app.globalData.token;
    this.setData({ isLoggedIn: !!token });
    
    if (token) {
      this.loadNFTs();
    }
  },

  async loadNFTs() {
    this.setData({ loading: true });

    try {
      const res = await app.request('/nft/my-nfts', 'GET');
      const nfts = res.data || [];
      
      // 计算统计
      const stats = {
        total: nfts.length,
        pending: nfts.filter((n: any) => n.deliveryStatus !== 'DELIVERED').length,
        delivered: nfts.filter((n: any) => n.deliveryStatus === 'DELIVERED').length
      };

      this.setData({
        nfts: this.filterByStatus(nfts, this.data.currentFilter),
        stats,
        loading: false
      });
    } catch (error) {
      console.error('加载NFT失败', error);
      this.setData({ loading: false });
      app.showToast('加载失败');
    }
  },

  filterNFTs(e: WechatMiniprogram.TouchEvent) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({ currentFilter: filter });
    this.loadNFTs();
  },

  filterByStatus(nfts: any[], filter: string) {
    if (filter === 'all') return nfts;
    if (filter === 'pending') return nfts.filter(n => n.deliveryStatus !== 'DELIVERED');
    if (filter === 'delivered') return nfts.filter(n => n.deliveryStatus === 'DELIVERED');
    return nfts;
  },

  goNFTDetail(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/nft-detail/nft-detail?tokenId=${id}`
    });
  },

  viewTrace(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/trace/result/result?tokenId=${id}`
    });
  },

  goLogin() {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  goPresale() {
    wx.switchTab({ url: '/pages/presale/presale' });
  }
});

