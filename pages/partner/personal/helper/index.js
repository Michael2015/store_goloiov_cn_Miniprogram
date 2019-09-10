// pages/partner/personal/helper/index.js
import HELP from './api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    HELP('help').then(src => {
      if (src) {
        this.setData({
          src
        })
      } else {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    })
  },
  imgloaded() {
    wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.hideLoading()
  }
})