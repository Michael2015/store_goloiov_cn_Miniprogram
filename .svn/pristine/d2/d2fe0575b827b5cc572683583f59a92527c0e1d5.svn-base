const app = getApp()

// 绑定this, 方便传递参数
const GET = app.http.get.bind(app.http)
const POST = app.http.post.bind(app.http)

// 代理搜索 处理缓存搜索结果 和 搜索结果 显示最后 原则
function searchProxy(url, disableCache = false) {
  this.url = url
  this.serial = 0
  if (disableCache !== true) {
    this.cache = {}
  }
}

searchProxy.prototype = {
  get(params) {
    return this._request(GET, params)
  },
  post(params) {
    return this._request(POST, params)
  },
  _request(reqFunc, params) {
    const key = JSON.stringify(params)
    if (this.cache) {
      // 使用了缓存
      if (this.cache[key]) {
        // 命中缓存
        return Promise.resolve(this.cache[key])
      }
    }
    // 没有缓存,请求接口
    const tempSerial = ++this.serial
    return new Promise((resolve) => {
      reqFunc(this.url, params).then(data => {
        if (this.cache) {
          // 缓存结果
          this.cache[key] = data
        }
        if (tempSerial === this.serial) {
          // 是最后一个结果
          resolve(data)
        }
        // 直接忽略此次结果
      })
    })
  }
}

export default searchProxy