import compositePoster from '../../../../utils/compositePoster/compositePoster'

const app = getApp()
let WxParse = require('../../../../utils/wxParse/wxParse.js')
var self;
// 低版本ios scroll-view 初始化时必须充满一屏才能滚动，给个默认高度就能满一屏
const defaultSwiperHeight = 400
Page({
  data: {
    imgList:[],
    phone:'',
    fouse:false,
    question:"",
  },
  onLoad: function (options) {
    self = this;
    this.setData({
      phone: app.globalData.userInfo.phone || ''
    })
  },
  selectPhoto() {
    var _this = this
    if (this.data.imgList.length < 10) {
      wx.chooseImage({
        success: function (res) {
          var tempFilePaths = res.tempFilePaths
          if (tempFilePaths.length < 10) {
            for (var key in tempFilePaths) {
              wx.uploadFile({
                url: `${app.globalData.HOST}/api/customer/index/upload`,
                filePath: tempFilePaths[key],
                name: 'b068931cc450442b63f5b3d276ea4297',
                formData: {
                  token: app.globalData.token
                  //token: '32f592bf56c0fb6df6c07bf5babb315f'
                },
                success(res) {
                  res = JSON.parse(res.data);
                  let imgList = _this.data.imgList.concat(`${app.globalData.HOST}` + '/' + res.data.url);
                  _this.setData({
                    imgList
                  })
                },
                fail: function () {
                  wx.showToast({
                    title: '上传失败',
                    icon: 'none'
                  })
                }
              })
            }
          }
          else {
            wx.showToast({
              title: '最多上传9张图片',
              icon: 'none'
            })
          }
        }
      })
    }
    else {
      wx.showToast({
        title: '最多上传9张图片',
        icon: 'none'
      })
    }
  },

  dophone(e)
  {
    let phone = e.detail.value;
    this.setData({phone:phone})
  },
  doquestion(e)
  {
    let question = e.detail.value;
    this.setData({question:question})
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
  },
  
  //提交评论
  save() {
    if (this.data.question === '') {
      wx.showToast({
        title: '请填写反馈内容',
        icon: 'none'
      })
      return
    }
    if (this.data.phone) {
      var preg = /^[1]([3-9])[0-9]{9}$/;
      if(!preg.test(this.data.phone))
      {
        wx.showToast({
          title: '请填写正确手机号',
          icon: 'none'
        })
        return
      }
    }

    app.http.post('/api/partner/home/feedback', {
      question: this.data.question,
      phone: this.data.phone,
      imglist: this.data.imgList,
    }).then(res => {
      wx.showModal({
        title: '反馈成功',
        content: '您的反馈已提交，我们尽快回复您',
        showCancel: false,
        success() {
          wx.navigateBack({
            delta: 1
          })
          // wx.switchTab({
          //   url: '/pages/common/order/order'
          // })
        }
      })
    })
  }




})