// app.ts
App<IAppOption>({
  globalData: {
    userInfo: null,
    token: '',
    apiBaseUrl: 'https://api.juyuan-nft.com/api/v1'
  },
  
  onLaunch() {
    // 检查登录状态
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
      this.getUserInfo();
    }
  },

  async getUserInfo() {
    try {
      const res = await this.request('/user/profile', 'GET');
      this.globalData.userInfo = res.data;
    } catch (error) {
      console.error('获取用户信息失败', error);
      wx.removeStorageSync('token');
      this.globalData.token = '';
    }
  },

  request(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) {
    return new Promise<any>((resolve, reject) => {
      wx.request({
        url: this.globalData.apiBaseUrl + url,
        method,
        data,
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.globalData.token}`
        },
        success: (res: any) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        },
        fail: reject
      });
    });
  },

  showLoading(title = '加载中...') {
    wx.showLoading({ title, mask: true });
  },

  hideLoading() {
    wx.hideLoading();
  },

  showToast(title: string, icon: 'success' | 'error' | 'none' = 'none') {
    wx.showToast({ title, icon });
  }
});

