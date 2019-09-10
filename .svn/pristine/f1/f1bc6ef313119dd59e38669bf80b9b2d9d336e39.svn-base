const app = getApp()

export default function HELP(name) {
  return app.http.get('/api/partner/home/getresource').then(data => {
    if (data && data.operation && data.operation[name]) {
      return ver(data.operation[name])
    } else {
      return null
    }
  })
}

function ver(src) {
  const _ = '10.0'
  if (/\?[^\=]+\=[^&]*(&[^\=]+\=[^&]*)*$/i.test(src)) {
    return src + '&_=' + _
  } else {
    return src + '?_=' + _
  }
}