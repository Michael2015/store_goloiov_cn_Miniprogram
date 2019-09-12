const app = getApp()
let page
Page({
    data: {
        showAuth: false,
        options: null,
        showAuthPhone: false,
        showBindPhone: false,
        checkText: '获取验证码',
        next: null, // 隐藏绑定手机对话框 进行下一步
        phone: '',
        code: '',
        sendingcode: false,
        sendedcode: false,
        submiting: false,
        argee: true
    },
    onLoad(options) {
        page = this;
        // 保存参数
        this.data.options = options || {};
        // 二维码进来参数处理
        if (options.scene) {
            const scene = decodeURIComponent(options.scene)
            if (typeof scene === 'string') {
                var arr = scene.split(',')
                // 重写入口参数 二维码带参格式有限制,所以采用这中简短格式
                // 把他当做分享来处理
                this.data.options = {
                    s: arr[0],
                    p: arr[1],
                    st: arr[2],
                    type: 'share'
                }
            }
        }
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success(res) {
                            // 保留用户信息
                            // app.globalData.userInfo = res.userInfo
                            // 自定义登陆
                            page.login(res.userInfo)
                        }
                    })
                } else {
                    //用户未授权的情况下
                    app.globalData.token = '';
                    app.globalData.role = 0;
                    app.globalData.partner_invite_id = options.share_id || 0;
                    app.globalData.shareInfo.share_user_id = options.s || 0; // 推荐人
                    app.globalData.shareInfo.share_partner_id = options.p || 0;// 店铺 或者 合伙人id
                    app.globalData.shareInfo.share_product_id = options.st  || 0;// 商品id
                    if (options.type === 'invite') {
                        let partner_invite_id = app.globalData.partner_invite_id;
                        // 邀请合伙人
                        wx.redirectTo({
                            url: '/pages/partner/personal/partner/invite?share_id='+partner_invite_id,
                        });
                    } else if (options.type === 'share') {
                        // 分享进来的
                        wx.redirectTo({
                            url: '/pages/customer/detail/detail?id=' + app.globalData.shareInfo.share_product_id+'&type=share'
                        });
                    } else {
                        wx.switchTab({
                            url: '/pages/customer/index/index'
                        });
                    }
                }
            }
        })
    },
    login(userInfo) {
        wx.showLoading()
        wx.login({
            success(res) {
                userInfo.code = res.code
                app.http.post('/routine/Login', {
                    info: userInfo,
                    share_partner_id: getPartner(page.data.options)
                }).then(res => {
                    wx.hideLoading()
                    // 保存用户信息
                    app.globalData.userInfo = res
                    // 设置token
                    app.globalData.token = res.token
                    // 判断用户角色
                    if (res.is_promoter === 0) {
                        // 用户是客户
                        app.globalData.role = 0
                        // wx.switchTab({
                        //   url: '/pages/customer/index/index'
                        //   // url: '/pages/partner/index/index'
                        // })
                    } else if (res.is_promoter === 1) {
                        // 用户是合伙人
                        app.globalData.role = 1
                        // wx.switchTab({
                        // url: '/pages/partner/index/index'
                        // url: '/pages/customer/index/index'
                        // })
                    } else {
                        wx.showToast('角色不存在')
                    }
                    // 设置tab
                    if (app.globalData.tabInst) {
                        app.globalData.tabInst.forEach(item => {
                            if (item && item.updateTab) {
                                console.log('uptab')
                                item.updateTab()
                            }
                        })
                        app.globalData.tabInst = []
                    }
                    // 提供给下一个
                    return res
                }).then(page.authPhone).then(page.submitPhone).then((res) => {
                    // 判断入口参数
                    analysisOptions(page.data.options, res)
                    // 不会走到这里来
                }).catch(err => {
                    wx.hideLoading()
                    // console.log(err)
                })
            }
        })
    },
    handleUserInfo(res) {
        if (res.detail.errMsg.indexOf('fail') > 0) {
            wx.showToast({
                title: '获取用户信息失败',
                icon: 'none'
            })
        } else {
            // 保留用户信息
            // app.globalData.userInfo = res.detail.userInfo
            if (this.data.argee) {
                this.login(res.detail.userInfo)
            } else {
                wx.showToast({
                    title: '请同意用户协议',
                    icon: 'none'
                })
            }
        }
    },
    handlePhoneNumber({
        detail
    }) {
        if (detail.encryptedData && detail.iv) {
            // 拿到信息了
            // console.log(detail.encryptedData, detail.iv)
            // 调接口
            wx.showLoading()
            app.http.post('/routine/login/getPhone', {
                encryptedData: detail.encryptedData,
                iv: detail.iv
            }).then(res => {
                // console.log(res)
                // 成功了, 重写手机号码
                if (res && res.phone) {
                    app.globalData.userInfo.phone = res.phone
                    // 绑定成功
                    app.globalData.userInfo.bind_phone = true
                }
                // 进入首页
                wx.hideLoading()
                this.data.next()
            })
        } else {
            // 授权手机失败
            this.data.next()
        }
    },
    authPhone(res) {
        // 隐藏授权弹窗
        this.setData({
            showAuth: false
        })
        if (res.bind_phone) {
            return Promise.resolve(res)
        } else {
            this.setData({
                showAuthPhone: true
            })
            return new Promise((resolve) => {
                // resolve(res)
                this.data.next = () => resolve(res)
            })
        }
    },
    submitPhone(res) {
        // 隐藏授权手机弹窗
        this.setData({
            showAuthPhone: false
        })
        if (res.bind_phone) {
            return Promise.resolve(res)
        } else {
            this.setData({
                showBindPhone: true
            })
            return new Promise((resolve) => {
                // resolve(res)
                this.data.next = () => resolve(res)
            })
        }
    },
    setPhone({
        detail
    }) {
        let {
            value
        } = detail
        this.setData({
            phone: value
        })
    },
    setCode({
        detail
    }) {
        let {
            value
        } = detail
        this.setData({
            code: value
        })
    },
    sendCode() {
        // console.log(this.data.phone, this.data.code)
        if (this.data.sendingcode) return
        if (!/^1[\d]{10}$/.test(this.data.phone)) {
            wx.showToast({
                title: '请输入正确手机号',
                icon: 'none'
            })
            return
        }
        this.data.sendingcode = true
        app.http.get('/api/server/sms/send', {
            mobile: this.data.phone,
            event: 'default'
        }).then(res => {
            console.log(res)
            var all = 30 // 30秒
            this.setData({
                checkText: all + 's',
                sendedcode: true
            })
            wx.showToast({
                title: '发送成功',
                icon: 'none'
            })
            const timer = setInterval(() => {
                if (--all <= 0) {
                    clearInterval(timer)
                    this.setData({
                        checkText: '获取验证码'
                    })
                    this.data.sendingcode = false
                } else {
                    this.setData({
                        checkText: all + 's'
                    })
                }
            }, 1000)
        }, e => {
            // 报错了
            this.data.sendingcode = false
        })
    },
    submit() {
        if (!this.data.phone || !this.data.code) return
        if (this.data.submiting) return
        if (!/^1[\d]{10}$/.test(this.data.phone)) {
            wx.showToast({
                title: '请输入正确手机号',
                icon: 'none'
            })
            return
        }
        if ( /*!this.data.sendedcode || */ !this.data.code) {
            wx.showToast({
                title: '验证码不正确',
                icon: 'none'
            })
            return
        }
        this.data.submiting = true
        app.http.get('/api/partner/index/setphone', {
            phone: this.data.phone,
            smscode: this.data.code
        }).then(res => {
            console.log(res)
            this.data.submiting = false
            // 调下一步进入首页
            app.globalData.userInfo.phone = this.data.phone
            this.data.next()
        }, e => {
            this.data.submiting = false
        })
    },
    checkboxChange({
        detail
    }) {
        // 协议处理
        if (detail.value && detail.value.length > 0) {
            this.data.argee = true
        } else {
            this.data.argee = false
        }
    },
    onUnload() {
        wx.hideLoading()
    }
})

function analysisOptions(options, res) {
    if (options.type === 'invite') {
        // 邀请合伙人
        wx.redirectTo({
            url: '/pages/partner/personal/partner/invite?share_id=' + options.share_id
        })
        return true
    } else if (options.type === 'share') {
        // 分享进来的
        app.globalData.shareInfo.share_user_id = options.s // 推荐人
        app.globalData.shareInfo.share_partner_id = options.p // 店铺 或者 合伙人id
        app.globalData.shareInfo.share_product_id = options.st // 商品id
        //根据用户身份不同去对应的商品详情页
        if (res.is_promoter === 0) {
            wx.redirectTo({
                url: '/pages/customer/detail/detail?id=' + app.globalData.shareInfo.share_product_id+'&type=share'
            })
        } else if (res.is_promoter === 1) {
            wx.redirectTo({
                url: '/pages/partner/detail/detail?id=' + app.globalData.shareInfo.share_product_id+'&type=share'
            })
        }
    } else {
        if (res.is_promoter === 0) {
            // 客户进入
            if (!res.last_partner_info) {
                // 是一个新用户 跳注册合伙人
                // 直接进来注册合伙人 , 判断下 是不是客户，只有客户才来注册合伙人
                wx.redirectTo({
                    url: '/pages/partner/register/index'
                })
            } else {
                // 重做分享信息，相当于打开上次浏览的商品页
                app.globalData.shareInfo = res.last_partner_info
                console.log('重做上次分享信息：')
                console.log(app.globalData.shareInfo)
                wx.switchTab({
                    // url: '/pages/customer/detail/detail?id=' + app.globalData.shareInfo.share_product_id
                    url: '/pages/customer/index/index'
                })
            }
        } else if (res.is_promoter === 1) {
            // 合伙人
            wx.switchTab({
                url: '/pages/partner/index/index'
            })
        }
        return true
    }
    return false
}

function getPartner(options) {
    if (options.type === 'share') {
        return options.p
    }
}