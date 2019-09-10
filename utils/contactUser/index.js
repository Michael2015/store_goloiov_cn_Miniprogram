/**
 * 使用方法 
 * json配置引用组件，js导入Contact.js 页面放置 <Contact id='Contact-view'/> 标签
    Contact.show({
      data: {}
      close(){
        console.log('已关闭') // 关闭回掉 autoClose 为 true 时可选参数
      }
      success(res) { //成功回掉
        console.log(res)
      },
      error(res) { // 失败回掉
        console.log(res)
      }
    })
    Contact.close().then(() => {
      console.log('已关闭') // 关闭回掉
    })
 */
const app = getApp()
Component({
  data: {
    avatar: '',
    nickname: '',
    show: false
  },
  methods: {
    touchMove() {
      return;
    },
    close() {
      return new Promise((resolve) => {
        this.setData({
          show: false
        }, () => {
          resolve()
        })
      })
    },
    copy() {
      wx.setClipboardData({
        data: this.data.nickname
      })
    },
    call() {
      wx.makePhoneCall({
        phoneNumber: this.data.phone
      })
    },
    show(props) {
      this.setData({
        show: true,
        avatar: props[0].avatar,
        nickname: props[0].nickname,
        phone: props[0].phone ? props[0].phone : ''
      })
      return Promise.resolve()
    }
  }
})