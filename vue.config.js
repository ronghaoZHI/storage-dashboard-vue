const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: false,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('api', resolve('src/api'))
      .set('helper', resolve('src/service/Helper.js'))
      .set('querystring', 'querystring-browser')
  },
  devServer: {
    disableHostCheck: true,
  },
}
