// 合伙人菜单配置
const list = [{
  pagePath: "/pages/partner/index/index",
  iconPath: "/assets/image/home_mall_sel.png",
  selectedIconPath: "/assets/image/home_mall.png",
  text: "首页"
}, {
  pagePath: "/pages/common/order/order",
  iconPath: "/assets/image/home_Order_sel.png",
  selectedIconPath: "/assets/image/home_Order.png",
  text: "订单"
}, {
  pagePath: "/pages/partner/income/index",
  iconPath: "/assets/image/home_income_sel.png",
  selectedIconPath: "/assets/image/home_income.png",
  text: "收益"
}, {
  pagePath: "/pages/partner/personal/index",
  iconPath: "/assets/image/home_mine_sel.png",
  selectedIconPath: "/assets/image/home_mine.png",
  text: "我的"
}]

// 客户端菜单配置
const list1 = [{
  pagePath: "/pages/customer/index/index",
  iconPath: "/assets/image/home_mall_sel.png",
  selectedIconPath: "/assets/image/home_mall.png",
  text: "商城"
}, {
  pagePath: "/pages/common/order/order",
  iconPath: "/assets/image/home_Order_sel.png",
  selectedIconPath: "/assets/image/home_Order.png",
  text: "订单"
}, {
  pagePath: "/pages/partner/income/index",
  iconPath: "/assets/image/home_income_sel.png",
  selectedIconPath: "/assets/image/home_income.png",
  text: "收益"
}]
const app = getApp()
Component({
  data: {
    color: "#666",
    selectedColor: "#f22a33",
    list: [],
    selected: 0
  },
  properties: {
    badge: {
      type: String,
      value: ''
    }
  },
  ready() {
    console.log('tab ready')
    console.log('用户角色' + app.globalData.role)
    app.globalData.tabInst.push(this)
    if (app.globalData.role === 1) {
      this.setData({
        list: list
      })
    } else if(app.globalData.role === 0) {
      this.setData({
        list: list1
      })
    } else {
      // 还没登录
      var i = 0
      var timer = setInterval(()=> {
        if (i++ > 100) {
          clearInterval(timer)
          return
        }
        if (app.globalData.role === 1) {
          this.setData({
            list: list
          })
          clearInterval(timer)
        } else if(app.globalData.role === 0) {
          this.setData({
            list: list1
          })
          clearInterval(timer)
        }
      }, 100)
    }
  },
  attached() {
    console.log('tab attached')
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    },
    toggleToClient() {
      // 转换到客户端的tab
      // this.setData({
      //   list: list1
      // })
    },
    updateTab() {
      if (app.globalData.role === 1) {
        this.setData({
          list: list
        })
      } else if(app.globalData.role === 0) {
        this.setData({
          list: list1
        })
      }
    }
  }
})