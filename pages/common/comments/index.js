import Contact from '../../../utils/contactUser/contactUser'
const app = getApp()
var self;
Page({
  data: {
    imgList: [],
    orderId: '',
    productId: '',
    comment: '',
    desc_imgs: ['../../../assets/image/star_y.png', '../../../assets/image/star_y.png', '../../../assets/image/star_y.png', '../../../assets/image/star_y.png', '../../../assets/image/star_y.png'],
    service_imgs: ['../../../assets/image/star_y.png', '../../../assets/image/star_y.png', '../../../assets/image/star_y.png', '../../../assets/image/star_y.png', '../../../assets/image/star_y.png'],
    express_imgs: ['../../../assets/image/star_y.png', '../../../assets/image/star_y.png', '../../../assets/image/star_y.png', '../../../assets/image/star_y.png', '../../../assets/image/star_y.png'],
    service_star: 5,
    desc_star: 5,
    express_star: 5,
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
      productId: options.productId
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
    }).then(res => {
      wx.hideLoading()
      this.setData({
        orderInfo: res
      })
    }).catch((e) => {
      wx.hideLoading()
    })
  },
  selectPhoto() {
    var _this = this
    if (this.data.imgList.length < 4) {
      wx.chooseImage({
        success: function (res) {
          var tempFilePaths = res.tempFilePaths
          if (tempFilePaths.length < 5) {
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
              title: '最多上传4张图片',
              icon: 'none'
            })
          }
        }
      })
    }
    else {
      wx.showToast({
        title: '最多上传4张图片',
        icon: 'none'
      })
    }
  },
  //获取评论内容
  setCommentText(e) {
    this.setData({
      comment: e.detail.value
    })
  },
  //获取商家描述评分
  change(e) {
    var _this = this;
    let ix = e.target.dataset.index
    console.log(ix)
    let msg = e.target.dataset.msg
   
      if (msg == 'desc') {
        _this.data.desc_star = ix+1;
        for (var i = 0; i < 5; i++) {
          if(i > ix)
          {
        _this.data.desc_imgs[i] = '../../../assets/image/star_e.png';
        _this.setData({desc_imgs: _this.data.desc_imgs,})
          }
          else
          {
            _this.data.desc_imgs[i] = '../../../assets/image/star_y.png';
            _this.setData({desc_imgs: _this.data.desc_imgs,})
          }
        }
      }
      
      if(msg == 'express')
      {
        _this.data.express_star = ix+1;
        for (var i = 0; i < 5; i++) {
          if(i > ix)
          {
        _this.data.express_imgs[i] = '../../../assets/image/star_e.png';
        _this.setData({express_imgs: _this.data.express_imgs,})
          }
          else
          {
            _this.data.express_imgs[i] = '../../../assets/image/star_y.png';
            _this.setData({express_imgs: _this.data.express_imgs,})
          }
        }
      }

      if(msg == 'service')
      {
        _this.data.service_star = ix+1;
        for (var i = 0; i < 5; i++) {
          if(i > ix)
          {
        _this.data.service_imgs[i] = '../../../assets/image/star_e.png';
        _this.setData({service_imgs: _this.data.service_imgs,})
          }
          else
          {
            _this.data.service_imgs[i] = '../../../assets/image/star_y.png';
            _this.setData({service_imgs: _this.data.service_imgs,})
          }
        }
      }
    
  },

  //提交评论
  save() {
    if (this.data.comment === '') {
      wx.showToast({
        title: '请填写评论内容',
        icon: 'none'
      })
      return
    }

    app.http.post('/api/order/orderReplay', {
      order_id: this.data.orderId,
      product_id: this.data.productId,
      imglist: this.data.imgList,
      express_star: this.data.express_star,
      desc_star: this.data.desc_star,
      service_star: this.data.service_star,
      comment:this.data.comment,
    }).then(res => {
      wx.showModal({
        title: '提交成功',
        content: '您的评价已提交',
        showCancel: false,
        success() {
          wx.navigateBack({
            delta: 1
          })
          app.varStorage.set('orderListReload', true)
          // wx.switchTab({
          //   url: '/pages/common/order/order'
          // })
        }
      })
    })
  }



})


