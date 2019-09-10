// pages/partner/personal/partner/invite.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ok: false, // 判断页面时候有问题
    shareId: '',
    data: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var timer = null
    if (this.check()) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '您已是合伙人身份，将会跳转到您的合伙人店铺首页',
        confirmText: '立即跳转',
        success: (res) => {
          if (res.confirm) {
            clearTimeout(timer)
            wx.switchTab({
              url: '/pages/partner/index/index'
            })
          }
        }
      })
      // timer = setTimeout(()=> {
      //   wx.switchTab({
      //     url: '/pages/partner/index/index'
      //   })
      // }, 3000)
    }
    if (options && options.share_id) {
      this.data.shareId = options.share_id
      app.http.get('/api/partner/index/invite',{share_id: options.share_id}).then(data => {
        if (data) {
          this.setData({
            data
          })
          this.data.ok = true
        }
      })
    }
  },
  join() {
    if (this.data.ok) {
      app.http.get('/api/partner/index/join', {spid: this.data.shareId}).then(data => {
        // 到这里说明已经加入团队了
        // 直接跳首页
        app.globalData.role = null
        wx.reLaunch({
          url: '/pages/index/index'
        })
      })
    } else {
      wx.showToast({
        title: '缺少邀请人信息',
        icon: 'none'
      })
    }
  },
  check() {
    console.log(app.globalData.role === 1)
    return app.globalData.role === 1 // 判断是不是合伙人了
  }
})