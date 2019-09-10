import sharePoster from '../../../utils/sharePoster/sharePoster.js'
const app = getApp()
let text = '';
let self;
// 低版本ios scroll-view 初始化时必须充满一屏才能滚动，给个默认高度就能满一屏
const defaultSwiperHeight = 200
Page({
  data: {
    storelist: [],
    isLoad: 0,
    page: 1,
    limit: 10,
    getinfo: {},
    keyword: '',
    noviceShow: null,
    isAllowLoad:true,
    isAllowLoad2:true,
    coupon_id:0,
    coupon_date:'',
    coupon_price:0,
    coupon_title:'',
    showModal:false,
    pid:0,
    timeList:[],
    countDownList:[],
    bannerList:[],
    isShowCategory:0,//是否显示分类
    categoryList1:[],
    categoryList2:[],
    fenXiangShow:false,  //分享是否显示
    heightCount:0,   //统计监控交互的高度
    scrollTop:0,    //监控滑动距离
    tabTime:'',
    transverseCar_cateId:0,  //车联网专区的分类id
    transverseCarList:[],    //车联网专区显示数据
    selectClassId:0,         //标识选择id
    tabIndex:0,       //目前切换到的首页tab下标
    contentSwiperHeight: defaultSwiperHeight,
    isloading:false    //标识切换页是否处于加载状态
  },
  getShareImg() {
    sharePoster.createPoster({
      data: Object.assign({
        uid: app.globalData.userInfo.uid,
        pid: app.globalData.userInfo.uid
      })
    })
    this.checkoutFenXiang()
  },
   // 初始化内容swiper高度
    initContentSwiperHeight() {
    console.log('重新计算高度')
    let height = 0;
    let query = wx.createSelectorQuery()
    const lun = query.select('#item-wrap' + this.data.tabIndex)
    lun.boundingClientRect().exec(res =>{
      height = res[0].height
      if(height < defaultSwiperHeight){
        height = defaultSwiperHeight
      }
      this.setData({contentSwiperHeight:height})
    })
    
  },
  tabPageChange(event){
    this.goList({currentTarget:{dataset:{id:event.detail.currentItemId,index:event.detail.current}}})
  },
  getinfo() {
    app.http.get('/api/partner/home/getinfo').then(res => {
      wx.setNavigationBarTitle({
        title: res.site_name
      })
      this.setData({
        getinfo: res
      })
    })
  },
  storelist() {
    this.data.isAllowLoad = false;
    let timeList2 = [];
    // 针对用户进来选择了分类以及没有选择分类时下拉触发所要请求接口不同的处理
    const apiUrl = this.data.selectClassId === 0?'/api/partner/home/storelist':'/api/marketing/getCategoryProducts'
    const httpObj = this.data.selectClassId === 0?{page: this.data.page,limit: this.data.limit,keyword: this.data.keyword}:{cate_id:this.data.selectClassId}
    app.http.post(apiUrl, httpObj).then(res => {
      let storelist = this.data.storelist.concat(res);
      //处理倒计时
      for(let key in storelist)
      {
        if(storelist[key].seckill.status == 1)
        {
          timeList2[key] = storelist[key].seckill.data.stop_time;
        }
      }
      if (res && res.length < this.data.limit) {
        this.setData({
          isLoad: 1
        })
      } else {
        this.data.page++
      }
      this.setData({
        storelist,
        timeList:timeList2,
      });
      this.data.isAllowLoad = true;
      wx.hideLoading();
    })
  },
  // 监控当前页面触底事件
  onReachBottom(){
    this.loadmore()
  },
  //获取首页banner轮播图
  getBanner()
  {
    app.http.post('/api/marketing/getbanner', {}).then(res => {
      this.setData({
        bannerList:res,
      })
    });
  },
//获取首页分类
async getCategory()
{
  const categoryList = await app.http.post('/api/marketing/getCategory', {})
  let categoryList1 = categoryList.filter(function(item,index){
    return index != 0;
  });
  let transverseCar = categoryList.filter(function(item,index){
    return index === 0
  })
  this.setData({
    transverseCar_cateId:transverseCar[0].id
  })
  this.setData({
    categoryList1: categoryList1,
  })
},
// 获取车联网专区的数据
getTransverseCarData(){
  app.http.post('/api/marketing/getCategoryProducts',{cate_id :this.data.transverseCar_cateId}).then(res =>{
    this.setData({transverseCarList:res})
  })
},
//跳转分类列表页面
goList(e)
{
  let cat_id = +e.currentTarget.dataset.id;
  let tab_id = +e.currentTarget.dataset.index;
  this.setData({
    tabIndex:tab_id,
    selectClassId:cat_id,
    isloading:true
  })
  app.http.post('/api/marketing/getCategoryProducts',{cate_id :cat_id}).then(res =>{
    this.setData({storelist:res,isLoad:1,isloading:false})
  })
},
  timeFormat(param){//小于10的格式化函数
    return param < 10 ? '0' + param : param; 
  },
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
          this.setData({ countDownList: countDownArr});
          setTimeout(this.countDown,1000);
  },
  onLoad() {
    this.getinfo()
    this.CalculationHeight()
    self = this;
    wx.getStorage({
      key: 'noviceShow',
      success(e) {
        self.setData({
          noviceShow: 0
        })
      },
      fail(e) {
        self.setData({
          noviceShow: 1
        })
      }
    })
  },
  goDetails(e) {
    let storelistItem = this.data.storelist.filter(ele => {
      return ele.id == e.currentTarget.id
    })
    app.varStorage.set('storeDetail', storelistItem[0])
    wx.navigateTo({
      //由之前的跳转到分享页面，现在直接跳转到商品详情页面
      "url": "/pages/partner/detail/detail?id="+e.currentTarget.id
      // "url": "/pages/partner/share/index"
    });
  },
  //领取优惠券
  show_modal(e)
  {
    let pid = e.currentTarget.dataset.pid;
    app.http.post('/api/coupon/getCouponByPid', {
      product_id:pid
    }).then(res => {
      if(res.status == 0)
      {
        wx.showToast({
          title: '您已经领过优惠券啦',
          icon: 'none',
        })
      }else{
        this.setData({
          coupon_id: res.data.id,
          coupon_price:res.data.price,
          coupon_date:res.data.date,
          showModal:true,
          pid:pid
        })
      }
    })
  },
  hide_modal()
  {
    this.setData({
      showModal:false,
    })
  },
  //展开分类
  showCategory()
  {
    let isShowCategory = this.data.isShowCategory;
    isShowCategory = isShowCategory ? false :true;
    this.setData({isShowCategory:isShowCategory});
  },
  // 切换分享显示
  checkoutFenXiang(){
    this.setData({fenXiangShow:!this.data.fenXiangShow})
  },
   //领取优惠券
   get_coupon()
   {
    app.http.post('/api/coupon/setcoupon', {
      coupon_id: this.data.coupon_id,
    }).then(res => {
      wx.showToast({
        title: '领取成功',
        icon: 'none',
      })
     
      //隐藏成功领取的优惠券 
      let  storelist = this.data.storelist;
      let index = 0;
      for (let item of storelist) {
        if (item.id == this.data.pid) {
          storelist[index].coupon.status = 0;//已经领取
        }
        index++;
      }
      this.setData({
        showModal:false,
        storelist:storelist,
      })
    })
   },
  setSearchText(e) {
    let detail_val = e.detail.value.trim()

    if(!this.data.isAllowLoad || !this.data.isAllowLoad2) return;

    this.data.isAllowLoad2 = false;
    if (detail_val != text) {
      text = detail_val
      this.setData({
        page: 1,
        storelist: [],
        keyword: detail_val, // 不搜索空串
      }, () => {
        this.storelist()
      })

    }
    this.data.isAllowLoad2 = true;
  },
  clearText() {
    this.setData({
      page: 1,
      storelist: [],
      keyword: '', // 不搜索空串
    }, () => {
      this.storelist()
    })
  },
  loadmore() {
    if (this.data.isLoad || !this.data.isAllowLoad) return
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    this.storelist()
  },
  async CalculationHeight(){
    let height = 0;
    let query = wx.createSelectorQuery()
    const lun = query.select('.countTop')
    const res = await new Promise((resolve, reject) => {
      lun.fields({
        dataset: true,
        size: true,
        scrollOffset: true,
        properties: ['scrollX', 'scrollY']
      }, function (res) {
        resolve(res)
      }).exec()
    })
    height = res.height
    this.setData({heightCount:height})
  },
  MonitorNav(event){
    this.setData({ scrollTop: event.detail.scrollTop})
  },
  onShow: async function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    console.log(app.varStorage.get('isShareBack'))
    if (app.varStorage.get('isShareBack') === undefined) {
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        page: 1,
        storelist: [],
        keyword: '', // 不搜索空串
        isLoad:0,
      })
      this.storelist();
    } else {
      app.varStorage.del('isShareBack')
    }
    //获取banner轮播广告
    this.getBanner();
    //获取分类
    await this.getCategory();
    //获取车联网专区数据
    this.getTransverseCarData();
  },
  onPageScroll:function(res){
    this.setData({ scrollTop: res.scrollTop })
  },
  onShareAppMessage: function () {
    return {
      title: `${app.globalData.userInfo.nickName}邀请你成为业务合伙人！`,
      path: '/pages/index/index?share_id=' + app.globalData.userInfo.uid + '&type=invite',
      imageUrl: '/assets/image/partner_share_poster.png'
    }
  },
  touchMove() {
    return
  },
  goHelper() {
    this.closeNovice();
    wx.navigateTo({
      "url": "/pages/partner/personal/helper/index"
    })
  },
  goHelperAll() {
    wx.navigateTo({
      "url": "/pages/partner/useDesc/index"
    })
  },
  closeNovice() {
    wx.setStorage({
      key: 'noviceShow',
      data: 1,
      success() {
        self.setData({
          noviceShow: 0
        })
      }
    })
  }
})