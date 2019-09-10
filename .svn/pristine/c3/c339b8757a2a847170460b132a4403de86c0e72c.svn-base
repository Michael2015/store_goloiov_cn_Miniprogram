const app = getApp()
var self;
Page({
  data: {},
  goPage(e) {
    if (e.target.dataset.url) {
      console.log(e.target.dataset.url)
      // wx.showLoading({
      //   mask: true
      // })
      wx.navigateTo({
        "url": e.target.dataset.url
      })
    }

  },
  onLoad(e) {
    self = this;
  }
})