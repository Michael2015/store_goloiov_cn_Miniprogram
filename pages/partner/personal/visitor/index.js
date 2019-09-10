// pages/partner/personal/visitor/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    loaded: false,
    page: 1,
    list: []
  },
  load() {
    const size = 10
    if (!this.data.loading && !this.data.loaded) {
      wx.showLoading()
      this.data.loading = true
      app.http.get('/api/partner.partner/lowerBrowsing', {
        page: this.data.page,
        limit: size
      }).then(data => {
        if (data) {
          this.data.list.push(...data)
          this.setData({
            list: this.data.list
          })
          if (data.length < size) {
            this.setData({
              loaded: true
            })
          } else {
            this.data.page++
          }
        }
        wx.hideLoading()
        this.data.loading = false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.load()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.data.loading) {
      wx.hideLoading()
    }
  }
})