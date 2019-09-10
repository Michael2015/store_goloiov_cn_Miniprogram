const app = getApp()
let self;
let isDisabled = 1;
Page({
  data: {
    getAddressList: [],
    def_add: {},
    isload: 0,
    price: {},
    mark: '',
    orderId: 0,
    is_show_action: 1,
    disabled_loading: false,
    user_address: '',
    real_name: '',
    phone: '',
    coupon_total:0,//包括优惠券和限时秒杀优惠价
    miandan_type:0,//免单类型,默认是无免单
  },
  price(product_id) {
    app.http.post('/api/partner/store/price', {
      product_id,
      order_id: this.data.orderId
    }).then(res => {
      let pay_price = res.price;
      //优惠券合伙秒杀//优惠券
      let coupon_total2 = 0.00;
      if(res.discount.status == 1)
      {
        coupon_total2 = res.discount.data.total || res.discount.data.save_money;
        pay_price =res.discount.data.price ? res.discount.data.price : (pay_price - coupon_total2);
      }
      //计算优惠后的价格
      this.setData({
        price: res,
        pay_price:parseFloat(pay_price).toFixed(2),
        coupon_total:parseFloat(coupon_total2).toFixed(2),
        info: app.varStorage.get('storeDetail'),
      });
      wx.hideLoading()
    })
  },
  pay(order_id, form_id) {
    app.http.get('/api/customer/pay/pay', {
      order_id
    }).then(res => {
      wx.hideLoading()
      if (res) {
        wx.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.package,
          signType: res.signType,
          paySign: res.paySign,
          success(res) {
            self.setData({
              disabled_loading: false
            })
            app.http.get('/api/customer/pay/queryOrder', {
              order_id,
              form_id,
            }).then(res => {
              // &position=${res.position}&outnums=${res.outnums}
              wx.reLaunch({
                "url": `/pages/customer/paysuccess/index?total_price=${res.total_price}&platoon_number=${res.platoon_number}&position=${res.position}&is_platoon=${res.is_platoon}`
              })
            })
          },
          fail() {
            self.setData({
              disabled_loading: false
            });
            //重定向到订单详情页面
             wx.navigateTo({
              url: '/pages/common/order/detail?orderId=' + order_id+'&userId=0',
            })
          }
        })
      } else {
        wx.showModal({
          content: '稍后重试 ',
          showCancel: false
        })
      }
    })
  },
  createOrder(formId) {
    //待支付订单处理逻辑
    if (this.data.orderId) {
      this.pay(this.data.orderId, formId);
      wx.hideLoading()
      isDisabled = 1;
    }else if (!this.data.orderId && self.data.product_id && self.data.def_add && self.data.def_add.id) {
       //下单之前让用户选择排队的队列
       //如果是加入公排，判断加入自购免单还是快速免单
      if(this.data.info.is_platoon == 1 && this.data.info.is_self_buy_platoon == 1)
      {
        //判断是否有快速免单
        this.setData({miandan_type:1});
      }
       wx.showLoading({
          mask: true
        });
        app.http.post('/api/order/createOrder', {
          product_id: self.data.product_id,
          address_id: self.data.def_add.id,
          mark: self.data.mark,
          miandan_type:self.data.miandan_type
        }).then(res => {
          this.pay(res.order_id, formId)
          wx.hideLoading()
          isDisabled = 1;
        }, () => {
          isDisabled = 1;
          self.setData({
            disabled_loading: false
          })
        })
    } else {
      wx.showToast({
        title: '请添加收货地址',
        icon: 'none',
        success: () => {
          isDisabled = 1
          this.setData({
            disabled_loading: false
          })
        }
      })
    }
  },
  setMark(e) {
    this.setData({
      mark: e.detail.value
    })
  },
  getAddressList() {
    if (this.data.orderId == '') {
      app.http.get('/api/Address/getAddressList').then(res => {
        let def_add;
        if (app.varStorage.get('selectAddress') !== undefined) {
          def_add = app.varStorage.get('selectAddress')
        } else {
          def_add = res.filter(ele => {
            return ele.is_default
          })
          if (def_add.length) {
            def_add = def_add[0]
          } else {
            def_add = res[0]
          }
        }
        this.setData({
          getAddressList: res,
          isload: 1,
          def_add
        })
        wx.hideLoading()
      })
    }
    else {
      let def_add = {};
      let address = this.data.user_address.split(" ");
      def_add.province = address[0],
        def_add.city = address[1],
        def_add.district = address[2],
        def_add.detail = address[3],
        def_add.real_name = this.data.real_name,
        def_add.phone = this.data.phone,
        this.setData({
          def_add
        })
    }
  },
  formSubmit(e) {
    if (isDisabled) {
      isDisabled = 0;
      this.setData({
        disabled_loading: true
      })
      this.createOrder(e.detail.formId)
    }
  },
  onLoad(e) {
    self = this;
    app.varStorage.del('isShareBack')
    if (e.id) {
      this.setData({
        product_id: e.id,
        orderId: e.order_id || '',
        mark: e.mark || '',
        user_address: e.user_address || '',
        phone: e.phone||'',
        real_name: e.real_name||'',
      })

      if (e.order_id) {
        this.setData({is_show_action: 0})
      }
      //this.getCoupon(e.id);
      this.price(e.id);
    } else
      wx.navigateBack()
  },
  goAddAddress() {
    wx.navigateTo({
      "url": "/pages/partner/addAddress/index"
    })
  },
  goAddList() {
    wx.navigateTo({
      "url": "/pages/partner/shippingAddress/index?selectAddress"
    })
  },
  onShow() {
    this.getAddressList();
  }
})