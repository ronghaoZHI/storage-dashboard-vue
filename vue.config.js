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

    config.when(
      process.env.NODE_ENV === 'production',
      (config) => config.output.chunkFilename('[contenthash].bundle.js'),
      (config) => config.performance.hints(false),
    )
  },
  devServer: {
    disableHostCheck: true,
    compress: true,
  },
  productionSourceMap: false,
}
