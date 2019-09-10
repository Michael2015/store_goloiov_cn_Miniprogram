// components/order/popup/shouhuo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ref: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    cb: null,
    from: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show(cb) {
      this.setData({
        show: true
      })
      this.data.cb = cb
    },
    hide() {
      if (this.data.cb) {
        this.data.cb(this.data.from)
        this.data.cb = null
      }
      this.data.from = null
      this.setData({
        show: false
      })
    },
    left() {
      this.data.from = 2
      this.hide()
    },
    right() {
      this.data.from = 1
      this.hide()
    }
  },
  attached() {
    if (this.data.ref) {
      const pages = getCurrentPages()
      const refs = pages[pages.length - 1].refs || (pages[pages.length - 1].refs = {})
      refs[this.data.ref] = this
    }
  }
})
