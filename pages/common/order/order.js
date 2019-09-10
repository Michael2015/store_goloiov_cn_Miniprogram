const app = getApp()
Page({
  data: {
    tabs: ['全部', '待支付','待发货', '已发货', '退款/售后'],
    // 订单类型 0：未支付,1：未发货，2：已发货，3：退款
    orderType: '',
    keyword: '',
    page: 1,
    pageSize: 10,
    // 当前tab的index
    currentTab: 0,
    orderList: [],
    more: true,
    showClearIcon: false,
    inputFocus: false,
    // tab是否已经切换过
    isTabChanged: false,
    isSearchAction:false,
  },
  onLoad() {
    // this.getList()
  },
  tabChange(event) {
    let index = event.currentTarget.dataset.index
    this.setData({
      currentTab: index,
      isSearchAction:false,
    })
  },
  handleScrollToLower() {
    let page = this.data.page + 1
    this.setData({
      page: page
    })
    if (this.data.more) {
      this.getList()
    }
  },
  listChange(event) {
    let index = event == 0 ? 0 :event.detail.current ;
    let orderType = ''
    switch (index) {
      case 0:
        orderType = ''
        break
      case 1:
        orderType = 0
        break
      case 2:
        orderType = 1
        break
      case 3:
        orderType = 2
        break
      case 4:
        orderType = -3
        break
      default:
        orderType = ''
    }
    this.setData({
      currentTab: index,
      page: 1,
      orderType: orderType,
      orderList: [],
      more: true,
      showClearIcon: false,
      inputFocus: false
    })
    if (!this.data.isTabChanged) {
      this.getList()
    }
  },
  getList() {
    wx.showLoading()
    let params = {
      page: this.data.page,
      limit: this.data.pageSize
    }
    params.status = this.data.orderType

    if (this.data.keyword) {
      params.kw = this.data.keyword
    }
    app.http.get('/api/order/getMyOrderList', params).then(res => {
      wx.hideLoading()
      this.data.orderList.push(...res)
      this.setData({
        orderList: this.data.orderList
      })
      if (res.length < this.data.pageSize) {
        this.setData({
          more: false
        })
      }
    }).catch((e) => {
      console.log(e)
      wx.hideLoading()
    })
  },
  search(event) {
    // 搜索是时跳转到第一页
    this.setData({
      currentTab: 0,
      orderType: '',
      page: 1,
      orderList: [],
      more: true,
      showClearIcon: false,
      inputFocus: false,
      isSearchAction:true,
    });
    if(this.data.currentTab == 0)
    {
      this.listChange(0);
    }
    //this.getList();
  },
  toDetail(event) {
    let orderId = event.currentTarget.dataset.orderid
    wx.navigateTo({
      url: 'detail?orderId=' + orderId+'&userId=0',
    })
  },
  clearKeyword() {
    this.setData({
      keyword: '',
      showClearIcon: false,
      inputFocus: true
    })
  },
  handleSearchInput(event) {
    console.log(event)
    let input = event.detail.value
    this.setData({
      keyword: input
    })
    if (this.data.keyword) {
      this.setData({
        showClearIcon: true
      })
    } else {
      this.setData({
        showClearIcon: false
      })
    }
  },
  handleSearchFocus() {
    if (this.data.keyword) {
      this.setData({
        showClearIcon: true
      })
    }
  },
  handleSearchBlur() {
    // setTimeout(() => {
    //   this.setData({
    //     showClearIcon: false
    //   })
    // }, 100)
    // this.search()
  },
  // 跳转查询物流信息
  toTrack2(event) {
    console.log('查看物流信息按钮')
    let id = event.target.dataset.id
    let name = event.target.dataset.name
    wx.navigateTo({
      url: '/pages/common/order/track?id=' + id + '&name=' + name
    })
  },
  onShowGetList() {
    return new Promise((resolve) => {
      let orderListKeepalive = app.varStorage.get('orderListKeepalive')
      let orderListReload = app.varStorage.get('orderListReload')
      if (!orderListKeepalive || orderListReload) {
        this.setData({
          orderType: '',
          keyword: '',
          page: 1,
          pageSize: 10,
          // 当前tab的index
          currentTab: 0,
          orderList: [],
          more: true,
          showClearIcon: false,
          inputFocus: false,
          isTabChanged: true
        })
        this.getList()
      }
      setTimeout(() => {
        resolve('onShow')
      }, 500)
    })
  },
  onReady() {
    if (typeof this.getTabBar === 'function' && this.getTabBar() && app.globalData.role === 0) {
      this.getTabBar().toggleToClient()
    }
  },
  onShow: function () {
    app.varStorage.set('orderListReload',1);
    this.onShowGetList().then(res => {
      this.setData({
        isTabChanged: false
      })
      app.varStorage.del('orderListReload')
    })
    // 判断是否已经拉取过数据, 如果有数据
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },
  onUnload() {
    wx.hideLoading()
    this.setData({
      isTabChanged: false
    })
  },
  onHide() {
    app.varStorage.del('orderListKeepalive')
    wx.hideLoading()
    this.setData({
      isTabChanged: false
    })
  }
})