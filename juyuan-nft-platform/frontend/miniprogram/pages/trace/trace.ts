// 溯源查询页
const app = getApp<IAppOption>();

Page({
  data: {
    tokenId: '',
    recentSearches: [] as string[]
  },

  onLoad() {
    // 加载历史搜索记录
    const history = wx.getStorageSync('traceHistory') || [];
    this.setData({ recentSearches: history });
  },

  onInputChange(e: WechatMiniprogram.Input) {
    this.setData({ tokenId: e.detail.value });
  },

  doSearch() {
    const { tokenId } = this.data;
    
    if (!tokenId || !/^\d+$/.test(tokenId)) {
      app.showToast('请输入有效的Token ID');
      return;
    }

    // 保存搜索历史
    this.saveToHistory(tokenId);

    // 跳转到结果页
    wx.navigateTo({
      url: `/pages/trace/result/result?tokenId=${tokenId}`
    });
  },

  searchRecent(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id;
    this.setData({ tokenId: id });
    this.doSearch();
  },

  saveToHistory(tokenId: string) {
    let history = wx.getStorageSync('traceHistory') || [];
    
    // 移除重复项
    history = history.filter((id: string) => id !== tokenId);
    
    // 添加到开头
    history.unshift(tokenId);
    
    // 最多保留10条
    history = history.slice(0, 10);
    
    wx.setStorageSync('traceHistory', history);
    this.setData({ recentSearches: history });
  },

  clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定清空搜索历史？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('traceHistory');
          this.setData({ recentSearches: [] });
          app.showToast('已清空');
        }
      }
    });
  },

  scanQRCode() {
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode'],
      success: (res) => {
        const url = res.result;
        const match = url.match(/trace\/(\d+)/);
        if (match) {
          this.saveToHistory(match[1]);
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

