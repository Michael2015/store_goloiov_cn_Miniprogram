// 合伙人菜单配置
const list = [{
  pagePath: "/pages/index/index",
  iconPath: "/assets/image/home_mall_sel.png",
  selectedIconPath: "/assets/image/home_mall.png",
  text: "首页"
}, {
  pagePath: "/pages/index/index",
  iconPath: "/assets/image/home_Order_sel.png",
  selectedIconPath: "/assets/image/home_Order.png",
  text: "订单"
}, {
  pagePath: "/pages/index/index",
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
  pagePath: "/pages/index/index",
  iconPath: "/assets/image/home_mall_sel.png",
  selectedIconPath: "/assets/image/home_mall.png",
  text: "商城"
}, {
  pagePath: "/pages/index/index",
  iconPath: "/assets/image/home_Order_sel.png",
  selectedIconPath: "/assets/image/home_Order.png",
  text: "订单"
}, {
  pagePath: "/pages/index/index",
  iconPath: "/assets/image/home_income_sel.png",
  selectedIconPath: "/assets/image/home_income.png",
  text: "收益"
}]


Component({
  data: {
    color: "#666",
    selectedColor: "#f22a33",
    list: list
  },
  properties: {
    client: {
      type: String
    },
    selected: {
      type: Number,
      value: 0
    },
    badge: {
      type: String,
      value: ''
    }
  },
  attached() {
    if (this.data.client) {
      this.toggleToClient()
    }
  },
  methods: {
    switchTab(e) {
      console.log(66666)
      const data = e.currentTarget.dataset
      const url = data.path
      wx.navigateTo({url})
      this.setData({
        selected: data.index
      })
    },
    toggleToClient() {
      // 转换到客户端的tab
      this.setData({
        list: list1
      })
    }
  }
})