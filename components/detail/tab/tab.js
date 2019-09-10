Component({
  properties: {
    data: {
      type: Array
    },
    activeIndex: {
      type: Number,
      value: 0
    }
  },
  methods: {
    handleChange(event) {
      this.setData({
        activeIndex: event.currentTarget.dataset.index
      })
      this.triggerEvent('change', {current: this.data.activeIndex})
    }
  }
})