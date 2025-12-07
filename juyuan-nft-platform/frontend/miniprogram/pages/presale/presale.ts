// 预售市场页
const app = getApp<IAppOption>();

Page({
  data: {
    presales: [] as any[],
    currentStatus: '',
    page: 1,
    limit: 10,
    loading: false,
    hasMore: true
  },

  onLoad() {
    this.loadPresales();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true });
    this.loadPresales().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  filterByStatus(e: WechatMiniprogram.TouchEvent) {
    const status = e.currentTarget.dataset.status;
    this.setData({
      currentStatus: status,
      page: 1,
      hasMore: true,
      presales: []
    });
    this.loadPresales();
  },

  async loadPresales(append = false) {
    if (this.data.loading) return;
    
    this.setData({ loading: true });

    try {
      const { currentStatus, page, limit } = this.data;
      const statusQuery = currentStatus ? `&status=${currentStatus}` : '';
      const res = await app.request(`/presale/list?page=${page}&limit=${limit}${statusQuery}`, 'GET');

      const presales = res.data.map((item: any) => ({
        ...item,
        soldPercent: Math.round((item.currentSupply / item.maxSupply) * 100),
        statusText: this.getStatusText(item.status),
        statusClass: this.getStatusClass(item.status),
        harvestDate: item.harvestDate ? new Date(item.harvestDate).toLocaleDateString() : '待定'
      }));

      this.setData({
        presales: append ? [...this.data.presales, ...presales] : presales,
        hasMore: presales.length === limit,
        loading: false
      });
    } catch (error) {
      console.error('加载预售列表失败', error);
      this.setData({ loading: false });
      app.showToast('加载失败');
    }
  },

  loadMore() {
    if (!this.data.hasMore || this.data.loading) return;
    
    this.setData({ page: this.data.page + 1 });
    this.loadPresales(true);
  },

  goDetail(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/presale/detail/detail?id=${id}`
    });
  },

  getStatusText(status: string) {
    const map: Record<string, string> = {
      UPCOMING: '即将开售',
      ACTIVE: '预售中',
      ENDED: '已结束'
    };
    return map[status] || status;
  },

  getStatusClass(status: string) {
    const map: Record<string, string> = {
      UPCOMING: 'upcoming',
      ACTIVE: 'active',
      ENDED: 'ended'
    };
    return map[status] || 'ended';
  }
});

