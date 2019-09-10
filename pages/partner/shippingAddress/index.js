import searchProxy from '../../../utils/searchProxy/index'
const app = getApp()
let click_is_back = false;
Page({
  data: {
    getAddressList: [],
    setSearchText: ''
  },
  getAddressList() {
    app.http.get('/api/Address/getAddressList').then(getAddressList => {
      // this.setData({
      //   getAddressList
      // }, () => {
      //   wx.hideLoading() 
      // })

      // setData的回调不被触发了
      this.setData({
        getAddressList
      })
      wx.hideLoading()
    })
  },
  deladdressFun(address_id) {
    app.http.get('/api/address/deladdress', {
      address_id
    }).then(res => {
      this.onShow()
    })
  },
  delAddress(e) {
    let id = e.target.id
    let self = this;
    wx.showModal({
      'title': '提示',
      'content': '是否删除该地址？',
      success(e) {
        if (e.confirm) {
          wx.showLoading({
            title: '删除中',
            mask: true
          })
          self.deladdressFun(id)
        }
      }
    })
  },
  editAddress(e) {
    let item = this.data.getAddressList.filter(ele => {
      return ele.id == e.target.id
    })[0]
    app.varStorage.set('addressItem', item)
    wx.navigateTo({
      "url": "/pages/partner/addAddress/index"
    })
  },
  onLoad(e) {
    click_is_back = e.hasOwnProperty('selectAddress')
  },
  address_item_click(e) {
    app.varStorage.set('selectAddress', this.data.getAddressList.filter(ele => {
      return ele.id == e.currentTarget.id
    })[0])
    if (click_is_back)
      wx.navigateBack()
  },
  goAddAddress() {
    wx.navigateTo({
      "url": "/pages/partner/addAddress/index"
    })
  },
  setSearchText(e) {
    const search = this.searchProxy || (this.searchProxy = new searchProxy('/api/Address/getAddressList', true))
    this.data.setSearchText = e.detail.value.trim()
    search.get({
      kw: this.data.setSearchText
    }).then(data => {
      this.setData({
        getAddressList: data
      })
    })
  },
  searchCommodity() {
    // console.log(this.data.setSearchText)
    // const kw = this.data.setSearchText.trim()
    // if (kw.length > 0 ){
    //   wx.showLoading()
    //   this.getAddressList(kw)
    // }else {
    //   wx.showToast({
    //     title: '请输入关键字',
    //     icon: 'none'
    //   })
    // }
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.varStorage.del('addressItem')
    this.getAddressList()
  }
})