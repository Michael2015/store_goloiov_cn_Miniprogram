import compositePoster from '../../../utils/compositePoster/compositePoster'
const app = getApp()
var self;
Page({
  data: {
    info: {},
    getinfo: {},
    product_rebate_amount: '',
    invite_user_count: '',
    coupon_id:0,
    coupon_date:'',
    coupon_price:0,
    coupon_title:'',
    showModal:false,
    time_backward:[],
    timeList:[],
  },
  //秒杀倒计时
  timeFormat(param){//小于10的格式化函数
    return param < 10 ? '0' + param : param; 
  },
  //秒杀倒计时
  countDown()
  {
        // 获取当前时间，同时得到活动结束时间数组
        let newTime = new Date().getTime();
        let endTimeList = this.data.timeList;
        let countDownArr = [];
        // 对结束时间进行处理渲染到页面
        for(let key in endTimeList)
        {
          if(endTimeList[key])
          {
            let endTime = new Date(endTimeList[key]).getTime();
            let obj = null;
             // 如果活动未结束，对时间进行处理
            if (endTime - newTime > 0){
              let time = (endTime - newTime) / 1000;
              // 获取天、时、分、秒
              let day = parseInt(time / (60 * 60 * 24));
              let hou = parseInt(time % (60 * 60 * 24) / 3600);
              let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
              let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
              obj = {
                  day: this.timeFormat(day),
                  hou: this.timeFormat(hou),
                  min: this.timeFormat(min),
                  sec: this.timeFormat(sec)
              }
            }else{//活动已结束，全部设置为'00'
              obj = {
                day: '00',
                hou: '00',
                min: '00',
                sec: '00'
            }
          }
            countDownArr[key] = obj;
          }
          }
          // 渲染，然后每隔一秒执行一次倒计时函数
          this.setData({time_backward: countDownArr});
          setTimeout(this.countDown,1000);
  },
  getinfo() {
    let timeList2 = [];
    app.http.post('/api/partner/store/getinfo', {
      product_id: self.data.info.id
    }).then(res => {
      //判断是否有秒杀活动
      if(res.seckill.status == 1 || res.seckill.status == -1)
      {
        let time = res.seckill.status == 1 ? res.seckill.data.stop_time :res.seckill.data.start_time ;
        timeList2.push(time);
        this.setData({
          timeList:timeList2,
        });
        this.countDown();
      }
      this.setData({
        getinfo: res,
        coupon_id:res.coupon.data.id||0,
        coupon_title:res.coupon.data.title||'',
        coupon_price:res.coupon.data.price||0,
        coupon_date:res.coupon.data.date||'',
      })
      wx.hideLoading()
    })
  },
  share() {
    app.http.post('/api/customer/product/share', {
      product_id: this.data.info.id
    }).then(res => {
      this.setData({
        product_rebate_amount: res.profit.product_rebate_amount || null,
        invite_user_count: res.profit.invite_user_count || null
      })
    })
  },
  onLoad(e) {
    wx.showLoading({
      mask: true
    })
    self = this;
    this.setData({
      info: app.varStorage.get('storeDetail')
    })
    this.getinfo();
    this.share();
    app.varStorage.set('isShareBack', 1)
  },
  getShareImg() {
    compositePoster.createPoster({
      data: Object.assign(self.data.info, {
        uid: app.globalData.userInfo.uid,
        pid: app.globalData.userInfo.uid
      })
    })
  },
  goSettlement() {
    wx.navigateTo({
      url: `/pages/partner/settlement/index?id=${self.data.info.id}`
    })
  },
//领取优惠券
show_modal()
{
  let coupon_id = this.data.coupon_id;
  let coupon_price = this.data.coupon_price;
  let coupon_date = this.data.coupon_date;
  this.setData({
    showModal:true,
    coupon_id:coupon_id,
    coupon_price:coupon_price,
    coupon_date:coupon_date
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
      coupon_id:0,
    })
  })
 },
  godetail() {
    wx.navigateTo({
      url: '/pages/partner/detail/detail?id=' + self.data.info.id
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '发现一个好商品【' + self.data.info.store_name + '】推荐给你！',
      path: `pages/index/index?type=share&s=${app.globalData.userInfo.uid}&p=${app.globalData.userInfo.uid}&st=${self.data.info.id}`,
      imageUrl: self.data.info.image
    }
  },
})