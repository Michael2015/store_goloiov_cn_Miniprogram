// pages/partner/personal/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inited: false,
    name:'',
    avatar: '',
    num:0
  },
  to: function(e) {
    const data = e.currentTarget.dataset
    const url = data.url
    wx.navigateTo({url})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const user = app.globalData.userInfo
    app.http.get('/api/partner/index').then(data => {
      if (data) {
        this.setData({
          num: data.member_nums,
          name: this.cut(user.nickName),
          avatar: user.avatarUrl
        })
      }
      this.data.inited = true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log(user)
    console.log(app.globalData.userInfo)
  },
  cut(str, len = 15) {
    if (str.length > len) {
      return str.substr(0, len)
    } else {
      return str
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
    // 刷新数据
    if (this.data.inited) {
      app.http.get('/api/partner/index').then(data => {
        if (data) {
          this.setData({
            num: data.member_nums
          })
        }
      })
    }
  }
})