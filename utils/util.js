module.exports = {
    queryNode: (page, node) => {
        return new Promise((resolve) => {
            const query = wx.createSelectorQuery().in(page)
            query.select(node).boundingClientRect((res) => {
                resolve(res)
            }).exec()
        })
    }
}