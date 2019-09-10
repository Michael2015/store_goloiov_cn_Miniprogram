// pages/partner/register/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.http.get('/api/partner/index/register').then(data => {
      if (data) {
        this.setData({
          data
        })
      }
    })
  },
  join() {
    // 这里是没有上级的
    app.http.get('/api/partner/index/join').then(data => {
      // 到这里说明已经加入团队了
      // 直接跳首页
      app.globalData.role = null
      wx.reLaunch({
        url: '/pages/index/index'
      })
    })
  }
})