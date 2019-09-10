// pages/partner/personal/wallet/cash.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 1, // 0 提现到银行卡， 1 提现到微信
    all: '',
    value: '',
    bank_code: null,
    bank_name: null,
    real_name: null,
    bank_num: ''
  },
  tab({target}) {
    const data = target.dataset
    this.setData({
      tab: data.i
    })
    if (this.data.tab === 0) {
      wx.showModal({
        title: '提示',
        content: '暂不支持提现到银行卡',
        showCancel: false,
        success:(res) => {
          if (res.confirm) {
            this.setData({
              tab: 1
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  goaddCard() {
    wx.navigateTo({
      "url": `/pages/partner/income/add-bank-card?real_name=${this.data.real_name?this.data.real_name:''}&bank_num=${this.data.bank_num?this.data.bank_num:''}`
    })
  },
  delbank() {
    app.http.get('/api/partner/index/delbank').then(data => {
      wx.showToast({
        title: '删除成功',
        icon: 'none',
        duration: 2000
      })
      this.getAll()
    })
  },
  onShow: function (options) {
    this.getAll()
  },
  getAll() {
    app.http.get('/api/partner/index/withdraw').then(data => {
      if (data) {
        this.setData({
          all: data.withdraw_amount,
          bank_code: data.bank_code ? data.bank_code.substr(data.bank_code.length - 4., data.bank_code.length) : null,
          bank_name: data.bank_name,
          real_name: data.real_name,
          bank_num: data.bank_code
        })
      }
    })
  },
  oninput({
    detail
  }) {
    let {
      value
    } = detail
    this.data.value = value
  },
  set() {
    if (Number(this.data.all) <= 0) {
      wx.showToast({
        title: '暂无可提现金额',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      value: Number(this.data.all)
    })
  },
  submit() {
    const value = Number(this.data.value)
    if (value != this.data.value || value <= 0 || value < 10) {
      wx.showToast({
        title: '请输入正确金额',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (value > Number(this.data.all)) {
      wx.showToast({
        title: '提现金额不能大于总金额',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (this.tab === 0&&!this.data.bank_code) {
      wx.showToast({
        title: '请添加银行卡',
        icon: 'none',
        duration: 2000
      })
      return
    }

    app.http.post('/api/partner/index/extract', {
      amount: value,
      extract_type: ['bank', 'wx'][this.data.tab]
    }).then(data => {
      console.log(data)
      wx.showToast({
        title: data || '提现成功',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        value: ''
      })
      this.getAll()
    }, () => {
      this.getAll()
    })
  }
})