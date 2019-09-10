// pages/partner/personal/wallet/cash-record.js
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
  },
  loadData() {
    const size = 20
    if (this.data.loading) return
    this.data.loading = true
    wx.showLoading()
    app.http.get('/api/partner/index/withdrawlist', {
      page: this.data.page
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
        this.data.loading = false
        wx.hideLoading()
      }
    })
  },
  loadmore() {
    !this.data.loaded && this.loadData()
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
    this.data.loading && wx.hideLoading()
  }
})