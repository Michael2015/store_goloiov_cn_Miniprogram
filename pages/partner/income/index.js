// pages/partner/income/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1, // 当前tab
    inited: false, // 是否初始化
    loading: false,// 加载中
    cash: '', // 可提现金额
    uncash: '',// 未结算
    all: '', // 总收入
    list: [], // 公排列表
    page: 1, // 公排列表页码
    loaded: false, // 公排加载完毕
    requesting: false, // 请求中
    list1: [], // 收益列表
    page1: 1, // 收益页码
    loaded1: false, // 收益加载完毕
    requesting1: false, // 请求中
    hack: ''
  },
  to: function(e) {
    const data = e.currentTarget.dataset
    const url = data.url
    wx.navigateTo({url})
  },
  change: function(e) {
    const detail = e.detail
    this.setData({
      index: detail.current
    })
  },
  setIndex: function(e) {
    const data = e.currentTarget.dataset
    this.setData({
      index: data.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
  },
  loadData() {
    this.showLoading()
    Promise.all([
      app.http.get('/api/partner.partner/getUserAmount').then(data => {
        this.setData({
          cash: data.cash_money,
          uncash: data.unsettled_money,
          all: data.total_money
        })
      }),
      this.loadGongPai(),
      this.loadShouYi()
    ]).then(() => {
      this.hideLoading()
      this.data.inited = true
    })
  },
  loadGongPai() {
    // 加载公排数据
    const size = 10
    return app.http.get('/api/partner.partner/platoonList', {
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
    })
  },
  loadShouYi() {
    // 加载收益数据
    const size = 10
    return app.http.get('/api/partner.partner/incomeList', {
      page: this.data.page1,
      limit: size
    }).then(data => {
      if (data) {
        this.data.list1.push(...data)
        this.setData({
          list1: this.data.list1
        })
        if (data.length < size) {
          this.setData({
            loaded1: true
          })
        } else {
          this.data.page1++
        }
      }
    })
  },
  gongPaiLoadmore() {
    if (this.data.requesting || this.data.loaded) return
    this.data.requesting = true
    this.showLoading()
    this.loadGongPai().then(() => {
      this.data.requesting = false
      this.hideLoading()
    })
  },
  shouYiLoadmore() {
    if (this.data.requesting1 || this.data.loaded1) return
    this.data.requesting1 = true
    this.showLoading()
    this.loadShouYi().then(() => {
      this.data.requesting1 = false
      this.hideLoading()
    })
  },
  resetData() {
    this.setData({
      list: [], // 公排列表
      page: 1, // 公排列表页码
      loaded: false, // 公排加载完毕
      requesting: false, // 请求中
      list1: [], // 收益列表
      page1: 1, // 收益页码
      loaded1: false, // 收益加载完毕
      requesting1: false, // 请求中
    })
  },
  showLoading() {
    if (!this.data.loading) {
      wx.showLoading()
      this.data.loading = true
    }
  },
  hideLoading() {
    if (this.data.loading) {
      wx.hideLoading()
      this.data.loading = false
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar() && app.globalData.role === 0) {
      this.getTabBar().toggleToClient()
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
    if (this.data.inited) {
      this.resetData()
      this.loadData()
    }
    this.hackHeight()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.hideLoading()
  },
  toCash(e) {
    // 发现金额是0的时候拦截跳转页面
    if (Number(this.data.cash) <= 0) {
      wx.showToast({
        title: '暂无可提现金额',
        icon: 'none'
      })
    } else {
      this.to(e)
    }
  },
  toOrderDetail(e) {
    const data = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/common/order/detail?orderId=' + data.id+'&userId='+data.userid
    })
  },
  hackHeight() {
    const query = wx.createSelectorQuery().in(this)
    query.select('#topbox').boundingClientRect((res) => {
        // console.log(res)
        this.setData({
          hack: 'height:calc(100vh - '+res.height+'px);'
        })
    }).exec()
  }
})