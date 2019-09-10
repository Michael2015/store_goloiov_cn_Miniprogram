const app = getApp()

Page({
  data: {
    total_price: '...',
    position: '', // 待免单人数
    outnums: '',
    miandanma: '' // 免单码
  },
  onLoad(e) {
    this.setData({
      total_price: e.total_price,
      position: e.position,
      outnums: e.outnums,
      miandanma: e.platoon_number,
      is_platoon: e.is_platoon // 是否是参加公排的商品
    });
  },
  goIndex() {
    if (app.globalData.role === 0)
      wx.switchTab({
        url: '/pages/customer/index/index',
      })
    else
      wx.switchTab({
        url: '/pages/partner/index/index',
      })
  },
  goDetail() {
    wx.navigateTo({
      url: '/pages/partner/personal/helper/gongpai'
    })
  },
  goOrder() {
    app.varStorage.set('orderListReload', true)
    wx.switchTab({
      url: '/pages/common/order/order',
    })
  }
})