// pages/partner/personal/partner/index.js
import Contact from '../../../../utils/contactUser/contactUser'
import searchProxy from '../../../../utils/searchProxy/index'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    name: '',
    list: [],
    all: 0,
    higher: null,
    default: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const user = app.globalData.userInfo
    app.http.get('/api/partner/index/member').then(data => {
      if (data) {
        this.setData({
          list: data.list,
          all: data.member_nums,
          name: this.cut(user.nickName),
          avatar: user.avatarUrl
        })
      }
    })
    app.http.get('/api/partner/index/higher').then(data => {
      if (data && data.nickname && data.avatar) {
        // 发现有昵称就认为有上级了
        this.setData({
          higher: data
        })
      } else if (data && data.avatar) {
        // 没有上级 ，就是万车品
        this.setData({
          default: data.avatar
        })
      }
    })
  },
  oninput({detail}) {
    let {value} = detail
    // console.log(value)
    if (value.trim){
      // 去掉空格
      value = value.trim()
    }
    // 空串直接返回
    // if (value.length === 0) return
    
    // 初始化搜索代理
    const search = this.searchProxy || (this.searchProxy = new searchProxy('/api/partner/index/member'))

    search.get({keyword: value}).then(data => {
      if (data) {
        this.setData({
          list: data.list,
          all: data.member_nums
        })
      }
    })
  },
  showHigher() {
    // 显示上级合伙人
    if (this.data.higher) {
      Contact.show(this.data.higher)
    } else {
      wx.showToast({
        title: '您没有上级',
        icon: 'none',
        duration: 2000
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  cut(str, len = 15) {
    if (str.length > len) {
      return str.substr(0, len)
    } else {
      return str
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '邀请你成为业务合伙人！',
      path: '/pages/index/index?share_id=' + app.globalData.userInfo.uid + '&type=invite',
      imageUrl: '/assets/image/partner_share_poster.png'
    }
  }
})