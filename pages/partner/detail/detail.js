import compositePoster from '../../../utils/compositePoster/compositePoster'
const app = getApp()
let WxParse = require('../../../utils/wxParse/wxParse.js')
var self;
// 低版本ios scroll-view 初始化时必须充满一屏才能滚动，给个默认高度就能满一屏
const defaultSwiperHeight = 400
Page({
    data: {
        // 商品id
        id: '',
        // 轮播图片
        imgUrls: [],
        title: {
            title: '',
            price: 0,
            sale: 0,
            store_name: ''
        },
        // 价格
        price: {},
        // 商品详情
        description: {},
        // 购买记录分页
        buyRecordPage: 1,
        // 购买记录分页大小
        buyRecordPageSize: 10,
        buyRecordList: [],
        // 购买记录是否有更多数据
        buyRecordMore: true,
        // 访客记录页码
        visitorPage: 1,
        // 访客记录页码大小
        visitorPageSize: 10,
        // 访客记录数据
        visitorList: [],
        // 访客记录是否有更多数据
        visitorMore: true,
        tabs: ['详情', '购买记录', '访客','评论'],
        // 当前tab页下标
        currentTab: 0,
        // 内容swiper高度
        contentSwiperHeight: defaultSwiperHeight,
        //评论记录
        commentRecordList: [],
        // 购买记录分页
        commentRecordPage: 1,
        //评论记录是否有更多数据
        commentRecordMore: true,
        coupon_id:0,
        coupon_date:'',
        coupon_price:0,
        coupon_title:'',
        seckill:'',
        time_backward:[],
        timeList:[],
        //控制分享显示
        fenXiangShow:false,
        is_promoter:1,
        share_type:''
    },
    toList() {
        wx.reLaunch({
            url: '/pages/partner/index/index'
        })
    },

    checkoutFenXiang(){
        this.setData({
            fenXiangShow:!this.data.fenXiangShow
        })
    },
    onLoad: function (options) {
        self = this;
        this.setData({
            id: options.id || 2, // 获取商品id
            seckill:'',
            info: app.varStorage.get('storeDetail'),
            share_type:options.type || '',
        })
        this.getPrice();
        // 调用接口获取详情数据
        this.getDetail();
        // 获取上牌详情
        this.getDescription();
        app.varStorage.del('isShareBack')
    },
    // 点击tab导航
    handleTabChange(event) {
        this.setData({
            currentTab: event.detail.current
        })
    },
    tabPageChange(event) {
        wx.showLoading()
        let index = event.detail.current
        this.setData({
            contentSwiperHeight: defaultSwiperHeight,
            currentTab: index,
            buyRecordMore: true,
            buyRecordList: [],
            buyRecordPage: 1,
            commentRecordList: [],
            commentRecordPage: 1,
            commentRecordMore: true,
            visitorList: [],
            visitorPage: 1,
            visitorMore: true
        })
        if (index === 0) {
            // 获取价格
            this.getDescription()
        } else if (index === 1) {
            // 获取商品详情
            this.getRecord()
        } else if (index === 2) {
            // 获取购买记录
            this.getVisitor()
        } else if (index === 3) {
            // 获取访客记录
            this.getComment()
        }else {
            console.log('没有该类型')
        }
    },
    // 页面滚动到底部
    handleScrollToLower() {
        // 购买记录加载更多
        if (this.data.currentTab === 1 && this.data.buyRecordMore) {
            let page = this.data.buyRecordPage + 1
            this.setData({
                buyRecordPage: page
            })
            this.getRecord()
        }
        // 访客记录加载更多
        if (this.data.currentTab === 2 && this.data.visitorMore) {
            let page = this.data.visitorPage + 1
            this.setData({
                visitorPage: page
            })
            this.getVisitor()
        }

        //获取评论
        if (this.data.currentTab === 3 && this.data.commentRecordMore){
            let page = this.data.commentRecordPage + 1
            this.setData({
                commentRecordPage: page
            })
            this.getComment()
        }

    },


    // 获取评论记录
    getComment() {
        wx.showLoading()
        app.http.get('/api/order/commentRecord', {
            product_id: this.data.id,
            page: this.data.commentRecordPage,
            limit: this.data.buyRecordPageSize
        }).then(res => {
            wx.hideLoading()
            this.data.commentRecordList.push(...res)
            for(var key in this.data.commentRecordList)
            {
                let arr = [];
                for(let ii = 0;ii < this.data.commentRecordList[key]['star_num'];ii++)
                {
                    arr.push('../../../assets/image/star_y.png');
                    this.data.commentRecordList[key]['imgs'] = arr;
                }

            }
            this.setData({
                commentRecordList: this.data.commentRecordList
            })
            this.initContentSwiperHeight(3)
            if (res.length < this.data.buyRecordPageSize) {
                this.setData({
                    commentRecordMore: false
                })
            }
        }).catch((e) => {
            wx.hideLoading()
        })
    },

    getDetail() {
        let timeList2 = [];
        wx.showLoading();
        //商品详情页带上分享信息
        if(this.data.share_type == 'share')
        {
            var params = {
                product_id: this.data.id,
                ...app.globalData.shareInfo
            }
        }
        else
        {
            var params = {
                product_id: this.data.id,
            }
        }
        app.http.get('/api/partner/store/getinfo', params).then(res => {
            wx.hideLoading()
            res.image = res.slider_image[0]
            app.varStorage.set('storeDetail', res);
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
                info: res,
                imgUrls: res.slider_image,
                share_url_query: res.share_url_query,
                seckill:res.seckill,
                title: {
                    title: res.store_name,
                    price: res.price,
                    sale: res.sales,
                    platoon_slow: res.platoon_slow,
                    platoon_fast: res.platoon_fast,
                    store_name: res.store_name,
                    is_platoon: res.is_platoon,
                    coupon_id:res.coupon.data.id||0,
                    coupon_title:res.coupon.data.title||'',
                    coupon_price:res.coupon.data.price||0,
                    coupon_date:res.coupon.data.date||'',
                    seckill:res.seckill,
                    is_promoter:this.data.is_promoter,
                }
            });
        }).catch((e) => {
            wx.hideLoading()
        })
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
    getPrice() {
        wx.showLoading()
        app.http.get('/api/partner/store/price', {
            product_id: this.data.id
        }).then(res => {
            wx.hideLoading()
            this.setData({
                price: res
            })
        }).catch((e) => {
            console.log(e)
            wx.hideLoading()
        })
    },
    // 获取详情描述
    getDescription() {
        wx.showLoading()
        app.http.get('/api/partner/store/detail', {
            product_id: this.data.id
        }).then(res => {
            wx.hideLoading()
            let description = res.description.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
            description = description.replace(/float[\s]*:[\s]*(left|right)[\s]*;*/gi, 'float: auto;')
            this.setData({
                description: WxParse.wxParse('description', 'html', description, this, 5)
                // description: description
            })
            this.initContentSwiperHeight(0)
        }).catch((e) => {
            wx.hideLoading()
        })
    },
    // 获取购买记录
    getRecord() {
        console.log('获取购买记录')
        wx.showLoading()
        app.http.get('/api/partner/store/salesRecord', {
            product_id: this.data.id,
            page: this.data.buyRecordPage,
            limit: this.data.buyRecordPageSize
        }).then(res => {
            wx.hideLoading()
            this.data.buyRecordList.push(...res)
            this.setData({
                buyRecordList: this.data.buyRecordList
            })
            this.initContentSwiperHeight(1)
            if (res.length < this.data.buyRecordPageSize) {
                this.setData({
                    buyRecordMore: false
                })
            }
        }).catch((e) => {
            wx.hideLoading()
        })
    },
    // 获取访客记录
    getVisitor() {
        wx.showLoading()
        app.http.get('/api/partner/store/visitor', {
            product_id: this.data.id,
            page: this.data.visitorPage,
            limit: this.data.visitorPageSize
        }).then(res => {
            wx.hideLoading()
            this.data.visitorList.push(...res)
            this.setData({
                visitorList: this.data.visitorList
            })
            this.initContentSwiperHeight(2)
            if (res.length < this.data.visitorPageSize) {
                this.setData({
                    visitorMore: false
                })
            }
        }).catch((e) => {
            wx.hideLoading()
        })
    },
    // 初始化内容swiper高度
    initContentSwiperHeight(index) {
        wx.createSelectorQuery().select('#item-wrap' + index).boundingClientRect().exec(rect => {
            let h = rect[0].height;
            if (h < defaultSwiperHeight) {
                h = defaultSwiperHeight
            }
            this.setData({
                contentSwiperHeight: h
            })

            wx.hideLoading()
        })
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
    onUnload() {
        wx.hideLoading()
    },
    onShareAppMessage: function (res) {
        return {
            title: '发现一个好商品【' + self.data.title.title + '】推荐给你！',
            path: `pages/index/index?type=share&s=${app.globalData.userInfo.uid}&p=${app.globalData.userInfo.uid}&st=${self.data.info.id}`,
            imageUrl: self.data.imgUrls[0]
        }
    },
    // 滑动详情页
    descTouch(event) {
        console.log(44477)
        // 动态计算swiper高度
        this.initContentSwiperHeight(0)
    },
    //图片预览
    preview:function(event)
    {
        var imgList = event.currentTarget.dataset.list;//获取data-list
        var src = event.currentTarget.dataset.src;//获取data-list
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: imgList // 需要预览的图片http链接列表
        })
    }

})