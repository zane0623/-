// 个人中心页
const app = getApp<IAppOption>();

Page({
  data: {
    userInfo: null as any
  },

  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  loadUserInfo() {
    const userInfo = app.globalData.userInfo;
    this.setData({ userInfo });
  },

  formatWallet(address: string) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  },

  navigateTo(e: WechatMiniprogram.TouchEvent) {
    const url = e.currentTarget.dataset.url;
    
    // 检查是否需要登录
    const requireLogin = ['/pages/orders/orders', '/pages/delivery/delivery', '/pages/address/address', '/pages/kyc/kyc', '/pages/wallet/wallet'];
    
    if (requireLogin.includes(url) && !app.globalData.token) {
      app.showToast('请先登录');
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/login/login' });
      }, 1500);
      return;
    }
    
    wx.navigateTo({ url });
  },

  goLogin() {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录？',
      success: (res) => {
        if (res.confirm) {
          // 清除登录状态
          wx.removeStorageSync('token');
          app.globalData.token = '';
          app.globalData.userInfo = null;
          
          this.setData({ userInfo: null });
          app.showToast('已退出登录');
        }
      }
    });
  }
});

