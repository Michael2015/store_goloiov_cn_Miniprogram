Component({
  properties: {
    imgUrls: {
      type: Array
    }
  },
  data: {
    currentIndex: 1
  },
  methods: {
    handleChange(event) {
      this.setData({
        currentIndex: event.detail.current + 1
      })
    },
    previewImg(event) {
      let index = event.currentTarget.dataset.index
        wx.previewImage({
          current: this.data.imgUrls[index],
          urls: this.data.imgUrls,
          success: res => {
          }
        })
    }
  }
})