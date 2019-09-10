const app = getApp()
let banklist;
Page({
  data: {
    bank_list: [],
    index: '',
    banktext: '',
    name: '',
    cardid: ''
  },
  bindPickerChange(e) {
    this.setData({
      banktext: this.data.bank_list[e.detail.value]
    })
  },
  setname(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindbank(senddata) {
    app.http.post('/api/partner/index/bindbank', senddata).then(data => {
      wx.showModal({
        'title': '保存成功',
        'content': '您的银行卡信息保存成功',
        showCancel: false,
        success(e) {
          wx.navigateBack()
        }
      })
    })
  },
  setcardid(e) {
    if (!/^([\d]{4}[\s]+)*[\d]{0,3}$/.test(e.detail.value)) {
      this.setData({
        cardid: e.detail.value.replace(/[^\d]|\s/g, '').replace(/(\d{4})(?=\d)/g, '$1　')
      })
    } else {
      this.setData({
        cardid: e.detail.value
      })
    }
  },
  save() {
    let bank_id;
    for (let i in banklist) {
      if (banklist[i] === this.data.banktext)
        bank_id = i
    }

    if (!this.data.name) {
      wx.showToast({
        title: '请填写持卡人姓名',
        icon: 'none'
      })
      return;
    }
    if (!this.data.cardid) {
      wx.showToast({
        title: '请填写银行卡号',
        icon: 'none'
      })
      return;
    }
    // if (!bank_id) {
    //   wx.showToast({
    //     title: '请选择银行',
    //     icon: 'none'
    //   })
    //   return;
    // }

    this.bindbank({
      real_name: this.data.name,
      bank_code: this.data.cardid.replace(/[^\d]/g, ''),
      bank_id
    })
  },
  bank() {
    // app.http.get('/api/partner/index/bank').then(data => {
    //   if (data) {
    //     let bank_list = []
    //     banklist = data.bank_list;
    //     for (let i in data.bank_list) {
    //       bank_list.push(data.bank_list[i])
    //     }
    //     this.setData({
    //       bank_list
    //     })
    //   }
    // })
  },
  onLoad(options) {
    if (options.real_name && options.bank_num) {
      this.setData({
        cardid: options.bank_num.replace(/[^\d]|\s/g, '').replace(/(\d{4})(?=\d)/g, '$1　'),
        name: options.real_name
      })
    }
    this.bank()
  },
  onHide() {}
})