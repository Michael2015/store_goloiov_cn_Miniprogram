const app = getApp()
Component({
  properties: {
    data: {
      type: Object,
    },
    partner:{
      type:Object,
    }
  },
  data: {
    showPlatoonPopup: false,
    showModal:false,
    joinMask:false,
    is_promoter:0
  },
  methods: {
  //领取优惠券
  show_modal()
  {
    let coupon_id = this.data.data.coupon_id;
    let coupon_price =  this.data.data.coupon_price;
    let coupon_date =  this.data.data.coupon_date;
    this.setData({
      coupon_id:coupon_id,
      coupon_price:coupon_price,
      coupon_date:coupon_date,
      showModal:true,
     });
  },
  hide_modal()
  {
    this.setData({
      showModal:false,
    })
  },
   //领取优惠券
   get_coupon(e)
   {
    app.http.post('/api/coupon/setcoupon', {
      coupon_id: this.data.coupon_id,
    }).then(res => {
      wx.showToast({
        title: '领取成功',
        icon: 'none',
      })
      this.setData({
        showModal:false,
      })
    })
   },
    openPlatoonPopup() {
      this.setData({
        showPlatoonPopup: true
      })
    },
    closePlatoonPopup() {
      this.setData({
        showPlatoonPopup: false
      })
    },
    toGPDesc() {
      wx.navigateTo({
        url: '/pages/partner/personal/helper/gongpai'
      })
    },
    checkJoinMask(){
      this.setData({joinMask:!this.data.joinMask})
    },
    joinTeam(){
      app.http.get('/api/partner/index/join', {spid: this.properties.partner.uid}).then(data => {
        // 到这里说明已经加入团队了
        // 直接跳首页
        wx.showToast({
          title: '加入成功',
          icon: 'success',
          duration: 2000
        })
        app.globalData.role = null
        wx.reLaunch({
          url: '/pages/index/index'
        })
      })
    }
  }
})