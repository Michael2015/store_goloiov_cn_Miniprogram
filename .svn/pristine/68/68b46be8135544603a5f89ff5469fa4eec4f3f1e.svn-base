const app = getApp()
const cache = {}

function getCache(url, cb) {
  const cacheRes = cache[url]
  if (cacheRes) {
    wx.getFileInfo({
      filePath: cacheRes.path,
      success(res) {
        if (res.digest === cacheRes._hash) {
          cb(cacheRes)
        } else {
          cb(null)
        }
      },
      fail(res) {
        cb(null)
      }
    })
  } else {
    cb(null)
  }
}

function putCache(url, res) {
  wx.getFileInfo({
    filePath: res.path,
    success(r) {
      if (r && r.digest) {
        res._hash = r.digest
        cache[url] = res
      }
    }
  })
}
let downFile = (url) => new Promise((resolve, reject) => {
  getCache(url, cacheRes => {
    if (cacheRes) {
      console.log('命中cache')
      resolve(cacheRes)
      return
    }
    wx.downloadFile({
      url,
      success(res) {
        wx.getImageInfo({
          src: res.tempFilePath,
          success(res) {
            // 缓存
            putCache(url, res)
            resolve(res)
          },
          fail() {
            reject(res.tempFilePath)
          }
        })
      },
      fail(res) {
        reject(res.tempFilePath)
      }
    })
  })
})
let self;
Component({
  data: {
    show: false
  },
  methods: {
    touchMove() {
      return;
    },
    createCanvas(img0, img1, store_name) {
      self = this;
      Promise.all([
        downFile(img0),
        downFile(img1)
      ]).then(res => {
        //setTimeout(() => {
        let [qrcode, commodity] = [...res]
        let ctx = wx.createCanvasContext('posterCanvas')
        ctx.rect(0, 0, 560, 800)
        ctx.setFillStyle('#ffffff')
        ctx.fill()
        let height = commodity.height * (560 / commodity.width);
        ctx.drawImage(commodity.path, 0, 0, 560, height)
        ctx.setFillStyle('#ffffff')
        height = height > 560 ? 560 : height;
        height = height < 500 ? 560 : height;
        console.log(height, '======================')
        ctx.fillRect(0, height, 560, 241)
        ctx.drawImage(qrcode.path, 339, 600, 163, 163)
        let rectangleTop = height - 44;
        ctx.setFillStyle('#f55254')
        ctx.fillRect(0, rectangleTop, 560, 44)
        ctx.font = 'normal 100 26px sans-serif';
        ctx.setFillStyle('#FFFFFF')
        let store_nameTextPx = ctx.measureText(store_name)
        if (store_nameTextPx.width >= 560) {
          store_name = store_name.substr(0, 15) + '...'
          store_nameTextPx = ctx.measureText(store_name)
        }
        ctx.fillText(store_name, ((560 - store_nameTextPx.width) / 2), rectangleTop + 32, 560)
        ctx.drawImage('/assets/image/blessing.png', 61, 643)
        ctx.draw(true, () => {
          wx.canvasToTempFilePath({
            canvasId: 'posterCanvas',
            x: 0,
            y: 0,
            destWidth: 1120,
            destHeight: 1600,
            success(res) {
              wx.hideLoading()
              self.setData({
                tempFilePath: res.tempFilePath,
                show: true
              })
            },
            fail(res) {
              wx.hideLoading()
              wx.showToast({
                title: '请稍后重试',
                icon: 'none'
              })
            }
          })
        })
        //}, 4000)
      }).catch(res => {
        wx.showToast({
          title: '请稍后重试',
          icon: 'none'
        })
        console.log('==== 二维码生成失败 ====')
        console.log(res)
        wx.showModal({
          title: '提示',
          content: res,
          showCancel: false
        })
      })
    },
    hide() {
      this.setData({
        show: false
      })
    },
    save() {
      wx.saveImageToPhotosAlbum({
        filePath: self.data.tempFilePath,
        success(res) {
          wx.showToast({
            title: '保存成功'
          })
        },
        fail() {
          wx.getSetting({
            success(res) {
              if (res.authSetting['scope.writePhotosAlbum'] === false) {
                wx.showModal({
                  'title': '保存失败',
                  'content': '请允许我们保存图片至您的手机',
                  success(e) {
                    if (e.confirm) {
                      wx.openSetting({
                        complete(e) {
                          if (e.authSetting['scope.writePhotosAlbum'] === true) {
                            wx.saveImageToPhotosAlbum({
                              filePath: self.data.saveImgTmpUrl,
                              success() {
                                wx.showToast({
                                  title: '图片保存成功'
                                })
                              }
                            })
                          } else {
                            wx.showToast({
                              title: '未获得权限',
                              icon: 'none'
                            })
                          }
                        }
                      });
                    } else {
                      self.hide();
                    }
                  }
                })
              }
            }
          })
        }
      })
    },
    createPoster(props) {
      wx.showLoading({
        mask: true
      })
      app.http.get('/api/partner.partner/getQrCode', {
        page: 'pages/index/index',
        scene: `${props[0].data.uid},${props[0].data.pid},${props[0].data.id}`
      }).then(res => {
        this.createCanvas(res.replace('.', app.globalData.HOST), props[0] ? props[0].data.image : {}, props[0].data.store_name)
      })
      // 这里的链接是不经过 app.http 方法的
      // this.createCanvas(`${app.globalData.HOST}/api/partner.partner/getQrCodes?token=${app.globalData.token}&page=pages/index/index&scene=${props[0].data.uid},${props[0].data.pid},${props[0].data.id}`, props[0] ? props[0].data.image : {}, props[0].data.store_name);
    }
  }
})