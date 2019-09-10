import Contact from '../../../utils/contactUser/contactUser'
const app = getApp()
Page({
  data: {
    orderId: '',
    orderInfo: {},
    partnerInfo: {
      nickname: '',
      phone: ''
    },
    showContact: false
  },
  onLoad(options) {
    this.setData({
      orderId: options.orderId,
      userId:options.userId
    })
  },
  onShow() {
    this.getDetail()
    // 缓存订单列表数据
    app.varStorage.set('orderListKeepalive', true)
  },
  getDetail() {
    wx.showLoading()
    app.http.get('/api/order/getOrderById', {
      order_id: this.data.orderId,
      user_id: this.data.userId
    }).then(res => {
      app.varStorage.set('storeDetail', res)
      wx.hideLoading()
      this.setData({
        orderInfo: res
      })
    }).catch((e) => {
      wx.hideLoading()
    })
  },
  copyInfo() {
    const NEXT = '\r\n'
    const orderInfo = this.data.orderInfo
    let info = orderInfo.store_name + NEXT +
      '订单号：' + orderInfo.order_id + NEXT +
      '物流单号：' + (orderInfo.delivery_id ? orderInfo.delivery_name + '('+orderInfo.delivery_id+')' : '空') + NEXT +
      '-----------' + NEXT +
      this.data.orderInfo.real_name + ' ' + this.data.orderInfo.user_phone + NEXT + this.data.orderInfo.user_address + NEXT +
      '-----------' + NEXT

    wx.setClipboardData({
      data: info,
      success(res) {
        wx.getClipboardData({
          success(res) {}
        })
      }
    })
  },
  confirmOrder() {
    if (this.data.orderInfo.is_platoon == 1) {
      // 只有参加公排的商品才走这个逻辑
      this.refs.shouhuo.show(res => {
        if (!res) return
        wx.showLoading()
        app.http.get('/api/order/confirmOrder', {
          type: res,
          order_id: this.data.orderId
        }).then(res => {
          wx.hideLoading()
          // wx.navigateBack({
          //   delta: 1
          // })
          wx.showModal({
            content: '确认收货成功',
            showCancel: false,
            success: res => {
              // 刷新当前页面
              this.getDetail()
              app.varStorage.del('orderListKeepalive')
            }
          })
        }).catch((e) => {
          wx.hideLoading()
        })
      })
      return
    }

    // 不参加公排的商品的收货
    wx.showModal({
      title: '提示',
      content: '确定确认收货吗?',
      success: res => {
        if (res.confirm) {
          wx.showLoading()
          app.http.get('/api/order/confirmOrder', {
            type: 1,
            order_id: this.data.orderId
          }).then(res => {
            wx.hideLoading()
            // wx.navigateBack({
            //   delta: 1
            // })
            wx.showModal({
              content: '确认收货成功',
              showCancel: false,
              success: res => {
                // 刷新当前页面
                this.getDetail()
                app.varStorage.del('orderListKeepalive')
              }
            })
          }).catch((e) => {
            wx.hideLoading()
          })
        } else if (res.cancel) {
          wx.hideLoading()
        }
      }
    })
  },
  // 退款
  refund() {
    wx.showModal({
      content: '确定退款吗?',
      success: res => {
        if (res.confirm) {
          wx.showLoading()
          app.http.get('/api/order/refund', {
            order_id: this.data.orderId,
            model_id: 1
          }).then(res => {
            wx.hideLoading()
            wx.showModal({
              content: '退款成功',
              showCancel: false,
              success: res => {
                // wx.navigateBack({
                //   delta: 1
                // })
                // 刷新当前页面
                this.getDetail()
                app.varStorage.del('orderListKeepalive')
              }
            })
          }).catch((e) => {
            wx.hideLoading()
          })
        } else if (res.cancel) {
          wx.hideLoading()
        }
      }
    })
  },
  // 跳转退货
  toSalesBack(event) {
    wx.navigateTo({
      url: `/pages/customer/refund/index?order_id=${this.data.orderId}&model_id=${this.data.status_of_order === 1?1:2}&real_name=${this.data.orderInfo.real_name}&user_phone=${this.data.orderInfo.user_phone}&user_address=${this.data.orderInfo.user_address}&image=${this.data.orderInfo.image}&store_name=${this.data.orderInfo.store_name}&pay_price=${this.data.orderInfo.pay_price}&suk=${this.data.orderInfo.suk}&total_num=${this.data.orderInfo.total_num}`
    })
  },
  //跳转支付页面
  goPay()
  {
    wx.navigateTo({
      url: `/pages/partner/settlement/index?order_id=${this.data.orderId}&id=${this.data.orderInfo.product_id}&mark=${this.data.orderInfo.mark}&user_address=${this.data.orderInfo.user_address}&real_name=${this.data.orderInfo.real_name}&phone=${this.data.orderInfo.user_phone}`
    })
  },
  // 跳转查询物流信息
  toTrack(event) {
    let id = event.target.dataset.id
    let name = event.target.dataset.name
    wx.navigateTo({
      url: '/pages/common/order/track?id=' + id + '&name=' + name
    })
  },
  contact() {
    let partnerInfo = JSON.parse(this.data.orderInfo.partner_info)
    this.setData({
      showContact: true,
      partnerInfo: {
        nickname: partnerInfo.nickname,
        phone: partnerInfo.phone
      }
    })
  },
  closeContact() {
    this.setData({
      showContact: false
    })
  },
  onUnload() {
    // 清除ref
    this.refs = null
    wx.hideLoading()
  },
  toDetail: function(e) {
    // 去商品详情
    // 判断用户角色, 如果是客户, 跳到客户端商品详情, 如果是合伙人, 跳到合伙人商品详情
    let role = app.globalData.role
    let url = ''
    switch (role) {
      case 0:
        url = '/pages/customer/detail/detail?id=' + this.data.orderInfo.product_id
        break
      case 1:
        url = '/pages/partner/detail/detail?id=' + this.data.orderInfo.product_id
        break
    }
    wx.navigateTo({
      url: url
    })
  },
comment()
{
  wx.navigateTo({
    url: '/pages/common/comments/index?productId=' + this.data.orderInfo.product_id+'&orderId='+this.data.orderId
  })
}
})


