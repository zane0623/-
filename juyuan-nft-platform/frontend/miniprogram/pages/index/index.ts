// 首页
const app = getApp<IAppOption>();

Page({
  data: {
    banners: [
      { id: 1, image: '/assets/banners/banner1.jpg', url: '' },
      { id: 2, image: '/assets/banners/banner2.jpg', url: '' },
      { id: 3, image: '/assets/banners/banner3.jpg', url: '' }
    ],
    hotPresales: [] as any[],
    loading: true
  },

  onLoad() {
    this.loadHotPresales();
  },

  onPullDownRefresh() {
    this.loadHotPresales().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadHotPresales() {
    try {
      const res = await app.request('/presale/list?status=ACTIVE&limit=3', 'GET');
      const presales = res.data.map((item: any) => ({
        ...item,
        soldPercent: Math.round((item.currentSupply / item.maxSupply) * 100),
        statusText: this.getStatusText(item.status),
        statusClass: this.getStatusClass(item.status)
      }));
      
      this.setData({
        hotPresales: presales,
        loading: false
      });
    } catch (error) {
      console.error('加载预售列表失败', error);
      this.setData({ loading: false });
    }
  },

  getStatusText(status: string) {
    const map: Record<string, string> = {
      UPCOMING: '即将开售',
      ACTIVE: '预售中',
      ENDED: '已结束',
      CANCELLED: '已取消'
    };
    return map[status] || status;
  },

  getStatusClass(status: string) {
    const map: Record<string, string> = {
      UPCOMING: 'upcoming',
      ACTIVE: 'active',
      ENDED: 'ended',
      CANCELLED: 'ended'
    };
    return map[status] || 'ended';
  },

  navigateTo(e: WechatMiniprogram.TouchEvent) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({ url });
  },

  goPresaleDetail(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/presale/detail/detail?id=${id}`
    });
  },

  onBannerTap(e: WechatMiniprogram.TouchEvent) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({ url });
    }
  },

  scanQRCode() {
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode'],
      success: (res) => {
        // 解析溯源链接
        const url = res.result;
        const match = url.match(/trace\/(\d+)/);
        if (match) {
          wx.navigateTo({
            url: `/pages/trace/result/result?tokenId=${match[1]}`
          });
        } else {
          app.showToast('无效的溯源二维码');
        }
      },
      fail: () => {
        app.showToast('扫码失败');
      }
    });
  }
});

