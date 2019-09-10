import compositePoster from '../../../utils/compositePoster/compositePoster'

const app = getApp()
let WxParse = require('../../../utils/wxParse/wxParse.js')
var self;
// 低版本ios scroll-view 初始化时必须充满一屏才能滚动，给个默认高度就能满一屏
const defaultSwiperHeight = 400
Page({
  data: {
    currentIndex: 1,
    // 轮播图片
    commentRecordList:[]
  },
  onLoad: function (options) {
    self = this;
    this.getMyComment();
  },
  //获取我的评论
  getMyComment()
  {
    wx.showLoading()
    app.http.get('/api/order/commentRecord', {
      model_id: 2,
    }).then(res => {
      wx.hideLoading()
      this.data.commentRecordList.push(...res)
      this.setData({
        commentRecordList: this.data.commentRecordList
      })
    }).catch((e) => {
      wx.hideLoading()
    })
  },
  handleChange(event) {
    this.setData({
      currentIndex: event.detail.current + 1
    })
  },
  previewImg(event) {
    let index = event.currentTarget.dataset.index
      wx.previewImage({
        current: this.data.imgUrls[index],
        urls: this.data.imgUrls,
        success: res => {
        }
      })
  }
})