// pages/partner/personal/helper/income.js
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
    HELP('income').then(src => {
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
  onHide: function () {
    wx.hideLoading()
  }
})